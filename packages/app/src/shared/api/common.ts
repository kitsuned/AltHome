export enum Intent {
	AddApps = 'add_apps',
}

export interface ActivateType {
	activateType?: 'home' | string;

	intent?: Intent;
}
