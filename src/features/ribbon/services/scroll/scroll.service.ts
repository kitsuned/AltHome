import { makeAutoObservable, observable, reaction, when } from 'mobx';

import { animate, motionValue } from 'framer-motion';

import { inject, injectable } from 'inversify';

import { RibbonSymbols } from '@di';

import { SettingsService } from 'shared/services/settings';

import type { LrudService } from '../lrud';

@injectable()
export class ScrollService {
	public container: HTMLElement | null = null;

	private wheelShift: number = 0;
	private scrollPosition = motionValue(0);

	public constructor(
		@inject(RibbonSymbols.LrudService) private readonly lrudService: LrudService,
		@inject(SettingsService) private readonly settingsService: SettingsService,
	) {
		makeAutoObservable<ScrollService, 'scrollPosition' | 'container' | 'containerBox'>(
			this,
			{
				container: observable.ref,
				containerBox: observable.struct,
				scrollPosition: false,
			},
			{ autoBind: true },
		);

		when(
			() => this.container !== null,
			() => {
				reaction(
					() => this.lrudService.selectedLaunchPointIndex,
					() => {
						this.wheelShift = this.focusedElementPosition;
					},
				);

				reaction(
					() => this.wheelShift,
					() => animate(this.scrollPosition, this.wheelShift),
				);
			},
		);

		this.scrollPosition.on('change', v => {
			this.container!.scrollLeft = v;
		});

		document.addEventListener('wheel', this.handleScroll);
	}

	public get isAnimating() {
		return this.scrollPosition.isAnimating();
	}

	private get focusedElementPosition() {
		if (!this.container || this.lrudService.selectedLaunchPointIndex === null) {
			return this.container?.scrollLeft ?? 0;
		}

		const element =
			this.container.children.length <= this.lrudService.selectedLaunchPointIndex
				? this.container.lastElementChild!
				: this.container.children[this.lrudService.selectedLaunchPointIndex];

		const box = element.getBoundingClientRect();

		const { width: viewportWidth } = document.body.getBoundingClientRect();

		if (box.left >= 0 && box.right <= viewportWidth) {
			return this.container.scrollLeft;
		}

		if (box.left < 0) {
			return this.container.scrollLeft + box.left;
		}

		if (box.right > viewportWidth) {
			return this.container.scrollLeft + box.right - viewportWidth;
		}

		return 0;
	}

	private get shiftThreshold() {
		const { scrollWidth, clientWidth } = this.container!;

		return scrollWidth - clientWidth;
	}

	private handleScroll({ deltaY }: WheelEvent) {
		this.wheelShift += deltaY * this.settingsService.wheelVelocityFactor;

		this.wheelShift = Math.max(0, Math.min(this.shiftThreshold, this.wheelShift));

		this.lrudService.blur();
	}
}
