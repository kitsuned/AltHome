import { makeAutoObservable, reaction, when } from 'mobx';

import { animationControls } from 'framer-motion';

import { inject, injectable } from 'inversify';

import { Intent } from 'shared/api/webos.d';
import { LauncherService } from 'shared/services/launcher';
import type { LaunchPointInstance } from 'shared/services/launcher';

import { KeyboardService } from '../keyboard';
import { ScrollService } from '../scroll';

@injectable()
export class RibbonService {
	public visible: boolean = false;
	public controls = animationControls();

	private transition: boolean = false;
	private ref: HTMLElement | null = null;

	private index: number | null = null;

	public constructor(
		@inject(LauncherService) public readonly launcherService: LauncherService,
		@inject(ScrollService) public readonly scrollService: ScrollService,
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

				if (!visible) {
					webOSSystem.hide();
				}
			},
		);

		keyboardService.emitter.on('shiftX', this.handleShift);
		keyboardService.emitter.on('enter', this.handleEnter);
		keyboardService.emitter.on('hold', this.handleHold);
		keyboardService.subscribe();

		// TODO move to lifecycle manager?
		document.addEventListener('webOSRelaunch', event => {
			if (event.detail?.intent) {
				this.handleIntent(event.detail.intent);
			} else {
				this.open();
			}
		});
	}

	public open() {
		if (!this.transition) {
			this.visible = true;
		}
	}

	public ribbonRef(ref: HTMLElement | null) {
		this.ref = ref;
		this.scrollService.container = ref;
		this.controls.mount();
	}

	public get selectedLaunchPoint(): LaunchPointInstance | null {
		return this.index !== null ? this.launcherService.visible[this.index] : null;
	}

	private get mounted() {
		return Boolean(this.ref);
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
		if (!this.index) {
			this.focusToFirstVisibleNode();
			return;
		}

		this.index = Math.min(
			this.launcherService.visible.length - 1,
			Math.max(0, this.index + shift),
		);
	}

	private handleEnter() {
		void this.selectedLaunchPoint?.launch();
	}

	private handleHold() {
		console.log('open ctx menu');
	}

	private handleIntent(intent: Intent) {
		if (intent === Intent.AddApps) {
			// this.showAppsDrawer = true;
		}
	}
}
