import { makeAutoObservable, reaction } from 'mobx';

import { inject, injectable } from 'inversify';

import { MenuAction } from '../../lib';
import { KeyboardService } from '../keyboard';
import type { RibbonService } from '../ribbon';

@injectable()
export class ContextMenuService {
	public visible: boolean = false;

	public ribbonService!: RibbonService;

	private action: MenuAction = MenuAction.Move;
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

					this.action = MenuAction.Move;
				}
			},
		);

		keyboardService.emitter.on('up', this.handleUp);
		keyboardService.emitter.on('down', this.handleDown);
		keyboardService.emitter.on('enter', this.handleEnter);
		keyboardService.emitter.on('back', this.handleBack);
	}

	public containerRef(ref: HTMLElement | null) {
		this.ref = ref;
	}

	public isActionSelected(action: MenuAction) {
		return this.action === action;
	}

	private handleUp() {
		if (this.action === MenuAction.Hide) {
			this.action = MenuAction.Move;
		}

		if (this.action === MenuAction.Uninstall) {
			this.action = MenuAction.Hide;
		}
	}

	private handleDown() {
		if (this.action === MenuAction.Hide && this.ribbonService.selectedLaunchPoint?.removable) {
			this.action = MenuAction.Uninstall;
		}

		if (this.action === MenuAction.Move) {
			this.action = MenuAction.Hide;
		}
	}

	private handleEnter() {
		const launchPoint = this.ribbonService.selectedLaunchPoint;

		if (!launchPoint) {
			return;
		}

		this.visible = false;

		if (this.action === MenuAction.Move) {
			this.ribbonService.moving = true;
		}

		if (this.action === MenuAction.Hide) {
			launchPoint.hide();
		}

		if (this.action === MenuAction.Uninstall) {
			void launchPoint.uninstall();
		}
	}

	private handleBack() {
		this.visible = false;
	}
}
