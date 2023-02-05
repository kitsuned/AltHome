import { makeAutoObservable, observable, reaction, when } from 'mobx';

import { animate, motionValue } from 'framer-motion';

import { settingsStore } from 'shared/services/settings';

import { lrudService } from '../lrud';

class ScrollService {
	public container: HTMLElement | null = null;

	private wheelShift: number = 0;
	private scrollPosition = motionValue(0);

	public constructor() {
		makeAutoObservable<ScrollService, 'scrollPosition' | 'containerBox'>(
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
					() => lrudService.selectedLaunchPointIndex,
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

	public scrollContainerRef(ref: HTMLElement) {
		this.container = ref;
	}

	public get isAnimating() {
		return this.scrollPosition.isAnimating();
	}

	private get focusedElementPosition() {
		if (!this.container || lrudService.selectedLaunchPointIndex === null) {
			return this.container?.scrollLeft ?? 0;
		}

		const element = this.container.children.length <= lrudService.selectedLaunchPointIndex
		                ? this.container.lastElementChild!
		                : this.container.children[lrudService.selectedLaunchPointIndex];

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
		this.wheelShift += deltaY * settingsStore.wheelVelocityFactor;

		this.wheelShift = Math.max(0, Math.min(this.shiftThreshold, this.wheelShift));

		lrudService.blur();
	}
}

export const scrollService = new ScrollService();
