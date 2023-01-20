declare class PalmServiceBridge {
	constructor(serviceId?: string);

	onservicecallback(serializedMessage: string): void;

	call(uri: string, serializedParameters: string): void;
}

declare namespace webOSSystem {
	const identifier: string;

	const launchParams: string;
	const launchReason: string;

	function hide(): void;
}

// declare interface webOSSystem {

// declare global {
// 	interface ActivateType {
// 		activateType?: 'home' | string;
// 	}
//
// 	interface Document {
// 		addEventListener(type: 'webOSRelaunch', listener: (this: Document, event: CustomEvent<ActivateType>) => void): void;
//
// 		removeEventListener(type: 'webOSRelaunch', listener: (this: Document, event: CustomEvent<ActivateType>) => void): void;
// 	}
// }
