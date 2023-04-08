import { makeAutoObservable, reaction, runInAction, when } from 'mobx';

import { animationControls } from 'framer-motion';

import { ActivateType, Intent } from 'shared/api/webos.d';

import { launcherStore, LaunchPoint } from 'shared/services/launcher';
import { settingsStore } from 'shared/services/settings';

import plus from 'assets/plus.png';

class RibbonService {
	public mounted: boolean = false;
	public visible: boolean = false;
	public controls = animationControls();

	public addAppsDrawerActive: boolean = false;

	private transition: boolean = false;

	public constructor() {
		makeAutoObservable(this, { controls: false }, { autoBind: true });

		// consequences of imperative life
		this.controls.mount();

		when(
			() => this.mounted && this.launchPoints.length !== 0,
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

		document.addEventListener('webOSRelaunch', (event) => {
			if (event.detail?.intent) {
				this.handleIntent(event.detail.intent);
			} else if (!this.transition) {
				runInAction(() => {
					this.visible = true;
				});
			}
		});
	}

	public get extraLaunchPoints(): LaunchPoint[] {
		const added = launcherStore.launchPoints.map(x => x.id);

		const extra = Array.from(launcherStore.availableLaunchPoints.keys())
			.filter(id => !added.includes(id));

		return Array.from(
			extra.map(x => launcherStore.availableLaunchPoints.get(x)!)
		);
	}

	public get launchPoints(): LaunchPoint[] {
		if (!launcherStore.launchPoints.length) {
			return [];
		}

		return [
			...launcherStore.launchPoints,
			<LaunchPoint>{
				id: 'com.kitsuned.althome',
				title: 'Add apps',
				removable: false,
				iconColor: '#242424',
				icon: plus,
				params: <ActivateType>{
					intent: Intent.AddApps,
				},
			},
		];
	}

	public launch(launchPoint: LaunchPoint) {
		if (launchPoint.id !== process.env.APP_ID) {
			ribbonService.visible = false;
		}

		void launcherStore.launch(launchPoint);
	}

	public move(lp: LaunchPoint, position: number) {
		const from = this.launchPoints.indexOf(lp);

		if (from !== position) {
			const ids = launcherStore.launchPoints.map(x => x.id);

			ids.splice(from, 1);
			ids.splice(position, 0, lp.id);

			settingsStore.order = ids;
		}
	}

	private handleIntent(intent: Intent) {
		if (intent === Intent.AddApps) {
			this.addAppsDrawerActive = true;
		}
	}
}

export const ribbonService = new RibbonService();
