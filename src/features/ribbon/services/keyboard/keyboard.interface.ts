import type { Emitter } from 'mitt';

type Shift = -1 | 1;

type IsomorphicTimeoutId = ReturnType<typeof setTimeout>;

export type TimerRef = {
	id: IsomorphicTimeoutId | null;
	fired: boolean;
};

export type KeyboardEvents = {
	enter: void;
	hold: void;
	shiftX: Shift;
	shiftY: Shift;
	left: void;
	right: void;
	up: void;
	down: void;
	back: void;
};

export type KeyboardEmitter = Emitter<KeyboardEvents>;
