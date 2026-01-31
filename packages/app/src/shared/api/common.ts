export enum Intent {
	AddApps = 'add_apps',
}

export interface ActivateType {
	activateType?: 'home' | string;

	intent?: Intent;
}

export interface InputRegion {
	x: number;
	y: number;
	width: number;
	height: number;
}
