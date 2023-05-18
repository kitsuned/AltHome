export enum Intent {
	AddApps = 'add_apps',
}

interface ActivateType {
	activateType?: 'home' | string;

	intent?: Intent;
}

interface InputRegion {
	x: number;
	y: number;
	width: number;
	height: number;
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

		/**
		 * Serialized JSON with basic device info.
		 */
		const deviceInfo: string;

		/**
		 * Tells compositor to hide the current layer. Works only on webOS 7+.
		 */
		function hide(): void;

		/**
		 * Tells compositor to activate the UI layer.
		 */
		function activate(): void;

		const window: {
			/**
			 * Set keyboard focus
			 */
			setFocus(focus: boolean): void;

			/**
			 * Set floating window input region
			 */
			setInputRegion(regions: [region: InputRegion]): void;
		};
	}

	interface Document {
		addEventListener(
			type: 'webOSRelaunch',
			listener: (this: Document, event: CustomEvent<ActivateType>) => void,
		): void;

		removeEventListener(
			type: 'webOSRelaunch',
			listener: (this: Document, event: CustomEvent<ActivateType>) => void,
		): void;
	}
}
