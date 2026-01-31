import type { Intent } from 'shared/api/common';

export type LifecycleManagerEvents = {
	relaunch: void;
	requestHide: void;
	intent: Intent;
};
