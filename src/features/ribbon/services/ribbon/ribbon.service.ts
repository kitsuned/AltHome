import { makeAutoObservable, reaction, runInAction, when } from 'mobx';

import { animationControls } from 'framer-motion';

import { inject, injectable } from 'inversify';

import { RibbonSymbols } from '@di';

import { Intent } from 'shared/api/webos.d';
import { LauncherService } from 'shared/services/launcher';
import type { LaunchPoint } from 'shared/services/launcher';
import { SettingsService } from 'shared/services/settings';

import type { ScrollService } from '../scroll';

@injectable()
export class RibbonService {
	public visible: boolean = false;
	public controls = animationControls();

	public addAppsDrawerActive: boolean = false;

	private mounted: boolean = false;
	private transition: boolean = false;

	public constructor(
		@inject(LauncherService) private readonly launcherService: LauncherService,
		@inject(SettingsService) private readonly settingsService: SettingsService,
		@inject(RibbonSymbols.ScrollService) private readonly scrollService: ScrollService,
	) {
		makeAutoObservable(this, { controls: false }, { autoBind: true });

		// consequences of imperative life
		this.controls.mount();

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

		document.addEventListener('webOSRelaunch', event => {
			if (event.detail?.intent) {
				this.handleIntent(event.detail.intent);
			} else if (!this.transition) {
				runInAction(() => {
					this.visible = true;
				});
			}
		});
	}

	public get availableLaunchPoints(): LaunchPoint[] {
		// TODO
		return [];
	}

	public get visibleLaunchPoints(): LaunchPoint[] {
		// TODO
		return this.launcherService.launchPoints;
	}

	public ribbonRef(ref: HTMLElement | null) {
		this.mounted = true;
		this.scrollService.container = ref;
	}

	public launch(launchPoint: LaunchPoint) {
		if (launchPoint.id !== process.env.APP_ID) {
			this.visible = false;
		}

		void this.launcherService.launch(launchPoint);
	}

	public move(lp: LaunchPoint, position: number) {
		const from = this.visibleLaunchPoints.indexOf(lp);

		if (from !== position) {
			const ids = this.launcherService.launchPoints.map(x => x.id);

			ids.splice(from, 1);
			ids.splice(position, 0, lp.id);

			this.settingsService.order = ids;
		}
	}

	private handleIntent(intent: Intent) {
		if (intent === Intent.AddApps) {
			this.addAppsDrawerActive = true;
		}
	}
}
