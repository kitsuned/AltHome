import { makeAutoObservable } from 'mobx';

import { launcherStore, type LaunchPoint } from 'shared/services/launcher';

import { ribbonService } from '../ribbon';

const enum SystemKey {
	Home = 0x3f5,
	Red = 0x193,
	Green = 0x194,
	Yellow = 0x195,
	Blue = 0x196
}

class LrudService {
	private currentIndex = 0;

	public constructor() {
		makeAutoObservable(this, {}, { autoBind: true });

		document.addEventListener('keydown', this.handleKeyDown);
	}

	public get selectedLaunchPoint() {
		return ribbonService.launchPoints[this.currentIndex];
	}

	public isSelected(launchPoint: LaunchPoint) {
		return this.selectedLaunchPoint === launchPoint;
	}

	public focusToNode(launchPointId: string) {
		this.currentIndex = ribbonService.launchPoints.findIndex(x => x.launchPointId === launchPointId);
	}

	private handleKeyDown(event: KeyboardEvent) {
		event.preventDefault();
		event.stopPropagation();

		if (event.key.startsWith('Arrow')) {
			this.handleArrow(event.key);

			return;
		}

		if (event.keyCode === SystemKey.Home || event.key === 'GoBack' || event.key === 'Enter') {
			ribbonService.visible = false;

			if (event.key === 'Enter') {
				void launcherStore.launch(ribbonService.launchPoints[this.currentIndex]);
			}
		}

		if (event.keyCode === SystemKey.Yellow || event.keyCode === SystemKey.Blue) {
			let newPosition = this.currentIndex;

			if (event.keyCode === SystemKey.Yellow && this.currentIndex > 0) {
				newPosition--;
			}

			if (event.keyCode === SystemKey.Blue && this.currentIndex !== ribbonService.launchPoints.length - 1) {
				newPosition++;
			}

			if (newPosition === this.currentIndex) {
				return;
			}

			void launcherStore.move(this.selectedLaunchPoint, newPosition);

			this.currentIndex = newPosition;
		}
	}

	private handleArrow(key: string) {
		if (key === 'ArrowLeft' && this.currentIndex !== 0) {
			this.currentIndex--;
		}

		if (key === 'ArrowRight' && this.currentIndex !== ribbonService.launchPoints.length - 1) {
			this.currentIndex++;
		}
	}
}

export const lrudService = new LrudService();
