import type { LunaMessage } from 'shared/services/luna';

export type Device = {
	label: string;
	appId: string;

	connected: boolean;
	activate: boolean;

	iconPrefix: string;
	icon: string;
};

type InputStatusMessage = {
	devices: Device[];
};

export type InputManagerMessage = LunaMessage<InputStatusMessage>;
