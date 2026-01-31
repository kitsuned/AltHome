import { makeAutoObservable, observable, reaction } from 'mobx';

import { inject, injectable } from 'inversify';

import { LauncherService } from 'shared/services/launcher';
import type { LaunchPointInstance } from 'shared/services/launcher';

import { KeyboardService } from '../keyboard';

@injectable()
export class AppDrawerService {
	public visible: boolean = false;

	private index: number = 0;
	private ref: HTMLElement | null = null;

	public constructor(
		@inject(LauncherService) private readonly launcherService: LauncherService,
		@inject(KeyboardService) keyboardService: KeyboardService,
	) {
		makeAutoObservable<AppDrawerService, 'ref'>(
			this,
			{ ref: observable.ref },
			{ autoBind: true },
		);

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

		reaction(
			() => this.items.length,
			length => {
				this.index = Math.min(this.index, length);
			},
		);

		keyboardService.emitter.on('shiftY', this.handleShift);
		keyboardService.emitter.on('enter', this.handleEnter);
		keyboardService.emitter.on('back', this.handleBack);
	}

	public get items() {
		return this.launcherService.hidden;
	}

	public containerRef(ref: HTMLElement | null) {
		this.ref = ref;
		this.ref?.focus();
	}

	public isSelected(launchPoint: LaunchPointInstance) {
		return this.items[this.index] === launchPoint;
	}

	private handleShift(shift: number) {
		this.index = Math.min(Math.max(0, this.index + shift), this.items.length - 1);
	}

	private handleEnter() {
		this.items[this.index]?.show();
		this.visible = false;
	}

	private handleBack() {
		this.visible = false;
	}
}
