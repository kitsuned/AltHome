import { makeAutoObservable, reaction, when } from 'mobx';

import { animationControls } from 'framer-motion';

import { inject, injectable } from 'inversify';

import { Intent } from 'shared/api/webos.d';
import type { LaunchPointInstance } from 'shared/services/launcher';
import { LauncherService } from 'shared/services/launcher';
import { LifecycleManagerService } from 'shared/services/lifecycle-manager';

import { AppDrawerService } from '../app-drawer';
import { ContextMenuService } from '../context-menu';
import { KeyboardService } from '../keyboard';
import { ScrollService } from '../scroll';

@injectable()
export class RibbonService {
	public visible: boolean = false;
	public moving: boolean = false;
	public controls = animationControls();

	private transition: boolean = false;
	private ref: HTMLElement | null = null;

	private index: number | null = null;

	public constructor(
		@inject(LauncherService) public readonly launcherService: LauncherService,
		@inject(ScrollService) public readonly scrollService: ScrollService,
		@inject(AppDrawerService) public readonly appDrawerService: AppDrawerService,
		@inject(ContextMenuService) public readonly contextMenuService: ContextMenuService,
		@inject(LifecycleManagerService) lifecycleManager: LifecycleManagerService,
		@inject(KeyboardService) keyboardService: KeyboardService,
	) {
		makeAutoObservable(this, { controls: false }, { autoBind: true });

		when(
			() => this.mounted && this.launcherService.fulfilled,
			() => {
				this.visible = webOSSystem.launchReason !== 'preload';
			},
		);

		reaction(
			() => this.visible,
			async visible => {
				const definition = visible ? 'show' : 'hide';

				this.transition = true;

				await this.controls.start(definition);

				this.transition = false;

				lifecycleManager[definition]();
			},
		);

		reaction(
			() => this.visible,
			() => {
				this.moving = false;
				this.contextMenuService.visible = false;
				this.appDrawerService.visible = false;
			},
		);

		reaction(
			() => this.index,
			index => {
				this.scrollService.selectedLaunchPointIndex = index;
			},
		);

		keyboardService.emitter.on('shiftX', this.handleShift);
		keyboardService.emitter.on('enter', this.handleEnter);
		keyboardService.emitter.on('hold', this.handleHold);
		keyboardService.emitter.on('back', this.handleBack);
		keyboardService.subscribe();

		lifecycleManager.emitter.on('intent', this.handleIntent);
		lifecycleManager.emitter.on('relaunch', this.toggle);
		lifecycleManager.emitter.on('requestHide', this.hide);

		// TODO lazy inject ribbon into ctx menu by symbol
		contextMenuService.ribbonService = this;
	}

	public get selectedLaunchPoint(): LaunchPointInstance | null {
		return this.index !== null ? this.launcherService.visible[this.index] : null;
	}

	public ribbonRef(ref: HTMLElement | null) {
		this.ref = ref;
		this.scrollService.container = ref;
		this.controls.mount();
	}

	public focusToLaunchPoint(launchPoint: LaunchPointInstance) {
		this.index = this.launcherService.visible.indexOf(launchPoint);
	}

	private get mounted() {
		return Boolean(this.ref);
	}

	private toggle() {
		if (!this.transition) {
			this.visible = !this.visible;
		}
	}

	private hide() {
		this.visible = false;
	}

	private focusToFirstVisibleNode() {
		for (const [index, child] of Array.from(this.ref?.children ?? []).entries()) {
			if (child.getBoundingClientRect().left >= 0) {
				this.index = index;
				return;
			}
		}
	}

	private handleIntent(intent: Intent) {
		if (intent === Intent.AddApps) {
			this.contextMenuService.visible = false;
			this.appDrawerService.visible = true;
		}
	}

	private handleShift(shift: number) {
		if (this.index === null) {
			this.focusToFirstVisibleNode();
			return;
		}

		const max = this.launcherService.visible.length - 1;
		const target = Math.max(0, Math.min(max, this.index + shift));

		if (this.moving && this.index !== target) {
			// TODO find a better way to handle internal lps
			if (this.selectedLaunchPoint && target !== max) {
				this.selectedLaunchPoint.move(shift);
			} else {
				return;
			}
		}

		this.index = target;
	}

	private handleEnter() {
		if (this.moving) {
			this.moving = false;
			return;
		}

		void this.selectedLaunchPoint?.launch();
	}

	private handleHold() {
		if (this.selectedLaunchPoint?.builtin === false) {
			this.contextMenuService.visible = true;
		}
	}

	private handleBack() {
		if (this.moving) {
			this.moving = false;
		} else {
			this.visible = false;
		}
	}
}
