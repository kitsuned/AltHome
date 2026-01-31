import { inject, injectable } from 'inversify';
import mitt from 'mitt';

import type { KeyboardEvents } from './keyboard.interface';
import { ArrowKey } from './keyboard.lib';
import { TimerRef } from './timer-ref';

const HOLD_THRESHOLD = 500;

@injectable()
export class KeyboardService {
	private ref!: HTMLElement;

	public emitter = mitt<KeyboardEvents>();

	public constructor(@inject(TimerRef) private readonly timerRef: TimerRef) {
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
		if (this.timerRef.id !== null) {
			return;
		}

		this.timerRef.id = setTimeout(() => {
			this.timerRef.id = null;
			this.timerRef.fired = true;

			this.emitter.emit('hold');
		}, HOLD_THRESHOLD);
	}

	private handleEnterKeyUp() {
		if (this.timerRef.id !== null) {
			if (this.timerRef.id) {
				clearTimeout(this.timerRef.id);
			}

			this.timerRef.id = null;

			if (!this.timerRef.fired) {
				this.emitter.emit('enter');
			}

			this.timerRef.fired = false;
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
