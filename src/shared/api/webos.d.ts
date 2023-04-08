export enum Intent {
	AddApps = 'add_apps',
}

interface ActivateType {
	activateType?: 'home' | string;

	intent?: Intent;
}

declare global {
	class PalmServiceBridge {
		constructor(serviceId?: string);

		onservicecallback(serializedMessage: string): void;

		call(uri: string, serializedParameters: string): void;
	}

	namespace webOSSystem {
		const identifier: string;

		const launchParams: ActivateType;
		const launchReason: string;

		function hide(): void;
	}

	interface Document {
		addEventListener(type: 'webOSRelaunch', listener: (this: Document, event: CustomEvent<ActivateType>) => void): void;

		removeEventListener(type: 'webOSRelaunch', listener: (this: Document, event: CustomEvent<ActivateType>) => void): void;
	}
}
