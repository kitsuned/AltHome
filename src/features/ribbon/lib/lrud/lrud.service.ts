import { makeAutoObservable, reaction } from 'mobx';

import { launcherStore, type LaunchPoint } from 'shared/services/launcher';

import { ribbonService } from '../ribbon';
import { scrollService } from '../scroll';

const enum SystemKey {
	Home = 0x3f5,
	Red = 0x193,
	Green = 0x194,
	Yellow = 0x195,
	Blue = 0x196
}

class LrudService {
	private currentIndex: number | null = null;
	private selectDownFiredCounter: number = 0;

	public moving: boolean = false;
	public showContextMenu: boolean = false;

	public constructor() {
		makeAutoObservable<LrudService, 'selectDownFiredCounter'>(
			this,
			{ selectDownFiredCounter: false },
			{ autoBind: true },
		);

		reaction(
			() => ribbonService.launchPoints.length,
			count => {
				if (this.currentIndex !== null && count <= this.currentIndex) {
					this.currentIndex = count - 1;
				}
			},
		);

		document.addEventListener('keydown', this.handleKeyDown);
		document.addEventListener('keyup', this.handleKeyUp);
	}

	public get selectedLaunchPoint() {
		return this.currentIndex !== null ? ribbonService.launchPoints[this.currentIndex] : null;
	}

	public get selectedLaunchPointIndex() {
		return this.currentIndex;
	}

	public isSelected(launchPoint: LaunchPoint) {
		return this.selectedLaunchPoint === launchPoint;
	}

	public getIndexByLaunchPoint(launchPoint: LaunchPoint) {
		return ribbonService.launchPoints.indexOf(launchPoint);
	}

	public blur() {
		this.currentIndex = null;
	}

	public focusToNode(launchPointId: string) {
		this.currentIndex = ribbonService.launchPoints.findIndex(x => x.launchPointId === launchPointId);
	}

	public closeMenu() {
		this.showContextMenu = false;
	}

	public enableMoveMode() {
		this.moving = true;
	}

	private focusToFirstVisibleNode() {
		for (const [index, child] of Array.from(scrollService.container!.children).entries()) {
			if (child.getBoundingClientRect().left >= 0) {
				this.currentIndex = index;
				return;
			}
		}
	}

	private handleKeyDown(event: KeyboardEvent) {
		event.preventDefault();
		event.stopPropagation();

		if (event.key.startsWith('Arrow')) {
			this.handleArrow(event.key);

			return;
		}

		if (event.key === 'GoBack' && this.showContextMenu) {
			this.showContextMenu = false;

			return;
		}

		if (event.key === 'Enter') {
			if (this.moving) {
				this.moving = false;

				return;
			}

			this.selectDownFiredCounter++;

			if (this.selectDownFiredCounter > 1 && !this.showContextMenu) {
				this.showContextMenu = true;
			}
		}

		if (event.keyCode === SystemKey.Home || event.key === 'GoBack') {
			ribbonService.visible = false;
		}
	}

	private handleKeyUp(event: KeyboardEvent) {
		if (event.key !== 'Enter') {
			return;
		}

		if (this.selectDownFiredCounter === 1 && this.selectedLaunchPoint) {
			ribbonService.visible = false;

			void launcherStore.launch(this.selectedLaunchPoint);
		}

		this.selectDownFiredCounter = 0;
	}

	private handleArrow(key: string) {
		if (this.currentIndex === null) {
			this.focusToFirstVisibleNode();

			return;
		}

		if (this.moving && this.selectedLaunchPoint) {
			let newPosition = this.currentIndex!;

			if (key === 'ArrowLeft' && this.currentIndex! > 0) {
				newPosition--;
			}

			if (key === 'ArrowRight' && this.currentIndex! !== ribbonService.launchPoints.length - 1) {
				newPosition++;
			}

			if (newPosition !== this.currentIndex) {
				launcherStore.move(this.selectedLaunchPoint, newPosition);
			}
		}

		if (key === 'ArrowLeft' && this.currentIndex !== 0) {
			this.currentIndex--;
		}

		if (key === 'ArrowRight' && this.currentIndex !== ribbonService.launchPoints.length - 1) {
			this.currentIndex++;
		}
	}
}

export const lrudService = new LrudService();
