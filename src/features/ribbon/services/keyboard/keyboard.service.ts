import { injectable } from 'inversify';
import mitt from 'mitt';

import type { KeyboardEvents } from './keyboard.interface';

const HOLD_THRESHOLD = 500;

type IsomorphicTimeoutId = ReturnType<typeof setTimeout>;

export enum ArrowKey {
	Left = 'ArrowLeft',
	Right = 'ArrowRight',
	Up = 'ArrowUp',
	Down = 'ArrowDown',
}

@injectable()
export class KeyboardService {
	private ref!: HTMLElement;
	private timerId: IsomorphicTimeoutId | null = null;
	private timerFired: boolean = false;

	public emitter = mitt<KeyboardEvents>();

	public constructor() {
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
	}

	public subscribe(ref: HTMLElement = document.body) {
		this.ref = ref;
		this.ref.addEventListener('keydown', this.handleKeyDown);
		this.ref.addEventListener('keyup', this.handleKeyUp);
	}

	public unsubscribe() {
		this.ref.removeEventListener('keydown', this.handleKeyDown);
		this.ref.removeEventListener('keyup', this.handleKeyUp);
	}

	private handleKeyboardEvent(event: KeyboardEvent) {
		event.stopPropagation();
	}

	private handleKeyDown(event: KeyboardEvent) {
		this.handleKeyboardEvent(event);

		if (event.key === 'GoBack') {
			this.emitter.emit('back');
		}

		if (event.key === 'Enter') {
			this.handleEnterKeyDown();
		}

		if (event.key.startsWith('Arrow')) {
			this.handleArrowKeyDown(event);
		}
	}

	private handleKeyUp(event: KeyboardEvent) {
		this.handleKeyboardEvent(event);

		if (event.key === 'Enter') {
			this.handleEnterKeyUp();
		}
	}

	private handleEnterKeyDown() {
		if (this.timerId !== null) {
			return;
		}

		this.timerId = setTimeout(() => {
			this.timerFired = true;

			this.emitter.emit('hold');
		}, HOLD_THRESHOLD);
	}

	private handleEnterKeyUp() {
		if (this.timerId !== null) {
			clearTimeout(this.timerId);

			this.timerId = null;

			if (!this.timerFired) {
				this.emitter.emit('enter');
			}

			this.timerFired = false;
		}
	}

	private handleArrowKeyDown({ key }: KeyboardEvent) {
		switch (key) {
			case ArrowKey.Left:
				this.emitter.emit('shiftX', -1);
				this.emitter.emit('left');
				break;
			case ArrowKey.Right:
				this.emitter.emit('shiftX', 1);
				this.emitter.emit('right');
				break;
			case ArrowKey.Up:
				this.emitter.emit('shiftY', -1);
				this.emitter.emit('up');
				break;
			case ArrowKey.Down:
				this.emitter.emit('shiftY', 1);
				this.emitter.emit('down');
				break;
		}
	}
}
