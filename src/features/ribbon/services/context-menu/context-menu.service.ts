import { makeAutoObservable, reaction } from 'mobx';

import { inject, injectable } from 'inversify';

import { KeyboardService } from '../keyboard';

@injectable()
export class ContextMenuService {
	public visible: boolean = false;

	private ref: HTMLElement | null = null;

	public constructor(@inject(KeyboardService) keyboardService: KeyboardService) {
		makeAutoObservable(this, {}, { autoBind: true });

		reaction(
			() => this.ref,
			ref => {
				if (ref) {
					keyboardService.subscribe(ref);
				} else {
					keyboardService.unsubscribe();
				}
			},
		);

		keyboardService.emitter.on('shiftY', this.handleShift);
		keyboardService.emitter.on('enter', this.handleEnter);
		keyboardService.emitter.on('back', this.handleBack);
	}

	public containerRef(ref: HTMLElement | null) {
		this.ref = ref;
	}

	private handleShift(shift: number) {
		console.log('menu move', shift);
	}

	private handleEnter() {
		console.log('menu enter');
	}

	private handleBack() {
		this.visible = false;
	}
}
