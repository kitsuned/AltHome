import { makeAutoObservable } from 'mobx';

import { LaunchPoint } from 'shared/services/launcher';
import { LunaTopic } from 'shared/services/luna';

import { InputDevice } from '../api/input-device.api';

type InputStatusMessage = {
	devices: InputDevice[];
};

class InputService {
	private readonly inputStatusMessage = new LunaTopic<InputStatusMessage>(
		'luna://com.webos.service.eim/getAllInputStatus',
	);

	public constructor() {
		makeAutoObservable(this, {}, { autoBind: true });
	}

	public get launchPoints(): LaunchPoint[] {
		return this.inputStatusMessage.message?.devices.map(this.mapDeviceToLaunchPoint) ?? [];
	}

	private mapDeviceToLaunchPoint(device: InputDevice): LaunchPoint {
		return {
			id: device.appId,
			title: device.label,
			removable: false,
			iconColor: '#ffffff',
			icon: `./root${device.iconPrefix}${device.icon}`,
		};
	}
}

export const inputService = new InputService();
