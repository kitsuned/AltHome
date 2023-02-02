import { makeAutoObservable, reaction, runInAction, when } from 'mobx';

import { animationControls } from 'framer-motion';

import { launcherStore } from 'shared/services/launcher';

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
				this.visible = true;
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

		document.addEventListener('webOSRelaunch', () => {
			if (!this.transition) {
				runInAction(() => {
					this.visible = true;
				});
			}
		});
	}

	public get launchPoints() {
		return launcherStore.launchPoints;
	}
}

export const ribbonService = new RibbonService();
