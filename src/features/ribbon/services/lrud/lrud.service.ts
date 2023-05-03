import { makeAutoObservable, reaction } from 'mobx';

import { inject, injectable } from 'inversify';

import { RibbonSymbols } from '@di';

import type { LaunchPoint } from 'shared/services/launcher';

import type { RibbonService } from '../ribbon';
import type { ScrollService } from '../scroll';

const enum SystemKey {
	Home = 0x3f5,
}

@injectable()
export class LrudService {
	private currentIndex: number | null = null;
	private selectDownFiredCounter: number = 0;

	public moving: boolean = false;
	public showContextMenu: boolean = false;

	public constructor(
		@inject(RibbonSymbols.RibbonService) private readonly ribbonService: RibbonService,
		@inject(RibbonSymbols.ScrollService) private readonly scrollService: ScrollService,
	) {
		makeAutoObservable<LrudService, 'selectDownFiredCounter'>(
			this,
			{ selectDownFiredCounter: false },
			{ autoBind: true },
		);

		reaction(
			() => this.ribbonService.visibleLaunchPoints.length,
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
		return this.currentIndex !== null
			? this.ribbonService.visibleLaunchPoints[this.currentIndex]
			: null;
	}

	public get selectedLaunchPointIndex() {
		return this.currentIndex;
	}

	public isSelected(launchPoint: LaunchPoint) {
		return this.selectedLaunchPoint === launchPoint;
	}

	public getIndexByLaunchPoint(launchPoint: LaunchPoint) {
		return this.ribbonService.visibleLaunchPoints.indexOf(launchPoint);
	}

	public blur() {
		this.currentIndex = null;
	}

	public focusToNode(id: string) {
		this.currentIndex = this.ribbonService.visibleLaunchPoints.findIndex(x => x.id === id);
	}

	public closeMenu() {
		this.showContextMenu = false;
	}

	public enableMoveMode() {
		this.moving = true;
	}

	private focusToFirstVisibleNode() {
		for (const [index, child] of Array.from(this.scrollService.container!.children).entries()) {
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

			if (
				this.selectDownFiredCounter > 1 &&
				!this.showContextMenu &&
				this.selectedLaunchPoint?.id !== process.env.APP_ID
			) {
				this.showContextMenu = true;
			}
		}

		if (event.keyCode === SystemKey.Home || event.key === 'GoBack') {
			this.ribbonService.visible = false;
		}
	}

	private handleKeyUp(event: KeyboardEvent) {
		if (event.key !== 'Enter') {
			return;
		}

		if (this.selectDownFiredCounter === 1 && this.selectedLaunchPoint) {
			void this.ribbonService.launch(this.selectedLaunchPoint);
		}

		this.selectDownFiredCounter = 0;
	}

	// TODO
	// eslint-disable-next-line sonarjs/cognitive-complexity
	private handleArrow(key: string) {
		if (this.currentIndex === null) {
			this.focusToFirstVisibleNode();
			return;
		}

		const max = this.ribbonService.visibleLaunchPoints.length - 1;

		if (this.moving && this.selectedLaunchPoint) {
			let newPosition = this.currentIndex!;

			if (key === 'ArrowLeft' && this.currentIndex! > 0) {
				newPosition--;
			}

			if (key === 'ArrowRight') {
				if (this.currentIndex! < max - 1) {
					newPosition++;
				}

				if (this.currentIndex! === max - 1) {
					return;
				}
			}

			if (newPosition !== this.currentIndex) {
				this.ribbonService.move(this.selectedLaunchPoint, newPosition);
			}
		}

		if (key === 'ArrowLeft' && this.currentIndex !== 0) {
			this.currentIndex--;
		}

		if (key === 'ArrowRight' && this.currentIndex !== max) {
			this.currentIndex++;
		}
	}
}
