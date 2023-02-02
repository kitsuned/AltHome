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

		this.scrollPosition.on('change', v => {
			this.container!.scrollLeft = v;
		});

		when(
			() => this.container !== null,
			() => {
				reaction(
					() => this.wheelShift,
					() => {
						animate(this.scrollPosition, this.wheelShift);

						lrudService.blur();
					},
				);
			},
		);

		document.addEventListener('wheel', this.handleScroll);
	}

	public scrollContainerRef(ref: HTMLElement) {
		this.container = ref;
	}

	private get shiftThreshold() {
		const { scrollWidth, clientWidth } = this.container!;

		return scrollWidth - clientWidth;
	}

	private handleScroll({ deltaY }: WheelEvent) {
		this.wheelShift += deltaY * settingsStore.wheelVelocityFactor;

		this.wheelShift = Math.max(0, Math.min(this.shiftThreshold, this.wheelShift));
	}
}

export const scrollService = new ScrollService();
