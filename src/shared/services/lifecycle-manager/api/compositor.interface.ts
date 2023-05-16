export type LifecycleEventType =
	| 'splash'
	| 'launch'
	| 'foreground'
	| 'background'
	| 'stop'
	| 'close';

export type LifecycleEvent = {
	event: LifecycleEventType;
	appId: string;
};
