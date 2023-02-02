import { makeAutoObservable } from 'mobx';

import { luna } from 'shared/services/luna';
import { launcherStore } from '../../../../shared/features/launcher';

import { ribbonService } from '../ribbon';

const enum SystemKey {
	Home = 0x3f5,
}

class LrudService {
	private currentIndex = 0;

	public constructor() {
		makeAutoObservable(this, {}, { autoBind: true });

		document.addEventListener('keydown', this.handleKeyDown);
	}

	public isSelected(launchPointId: string) {
		return ribbonService.launchPoints.findIndex(x => x.launchPointId === launchPointId) === this.currentIndex;
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
