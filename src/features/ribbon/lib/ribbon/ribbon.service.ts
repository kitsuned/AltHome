import { animationControls } from 'framer-motion';
import { makeAutoObservable, reaction, runInAction, when } from 'mobx';

import { ActivateType, Intent } from 'shared/api/webos.d';

import { launcherStore, LaunchPoint } from 'shared/services/launcher';

import plus from 'assets/plus.png';

class RibbonService {
	public mounted: boolean = false;
	public visible: boolean = false;
	public controls = animationControls();

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

	public get launchPoints() {
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
				largeIcon: plus,
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

	private handleIntent(intent: Intent) {}
}

export const ribbonService = new RibbonService();
