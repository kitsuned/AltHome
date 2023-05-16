import { makeAutoObservable, reaction, when } from 'mobx';

import { animationControls } from 'framer-motion';

import { inject, injectable } from 'inversify';

import { Intent } from 'shared/api/webos.d';
import { LauncherService } from 'shared/services/launcher';
import type { LaunchPointInstance } from 'shared/services/launcher';
import { LifecycleManagerService } from 'shared/services/lifecycle-manager';

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
		@inject(LifecycleManagerService) private readonly lifecycleManager: LifecycleManagerService,
		@inject(ContextMenuService) public readonly contextMenuService: ContextMenuService,
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
				this.transition = true;

				await this.controls.start(visible ? 'show' : 'hide');

				this.transition = false;

				if (visible) {
					this.lifecycleManager.show();
				} else {
					this.lifecycleManager.hide();
				}
			},
		);

		reaction(
			() => this.visible,
			() => {
				this.contextMenuService.visible = false;
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

		// TODO move to lifecycle manager
		document.addEventListener('webOSRelaunch', this.toggle);

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

	private focusToFirstVisibleNode() {
		for (const [index, child] of Array.from(this.ref?.children ?? []).entries()) {
			if (child.getBoundingClientRect().left >= 0) {
				this.index = index;
				return;
			}
		}
	}

	private handleShift(shift: number) {
		if (this.index === null) {
			this.focusToFirstVisibleNode();
			return;
		}

		const target = Math.min(
			this.launcherService.visible.length - 1,
			Math.max(0, this.index + shift),
		);

		if (this.moving && this.index !== target) {
			this.selectedLaunchPoint?.move(shift);
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
		this.contextMenuService.visible = true;
	}

	private handleBack() {
		this.visible = false;
	}
}
