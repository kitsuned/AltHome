import type { Intent } from 'shared/api/webos';

export type LifecycleManagerEvents = {
	relaunch: void;
	requestHide: void;
	intent: Intent;
};
