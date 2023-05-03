import { computed, makeObservable } from 'mobx';

import { injectable } from 'inversify';

import { LunaTopic } from 'shared/services/luna';

import type { LaunchPoint } from '../..';
import type { LaunchPointsProvider } from '../launch-points.provider';

import type { Device, InputManagerMessage } from './input-manager.interface';

@injectable()
export class InputProvider implements LaunchPointsProvider {
	private topic = new LunaTopic<InputManagerMessage>(
		'luna://com.webos.service.eim/getAllInputStatus',
	);

	public constructor() {
		makeObservable(this, { launchPoints: computed.struct });
	}

	public get fulfilled(): boolean {
		return Boolean(this.topic.message);
	}

	public get launchPoints(): LaunchPoint[] {
		const { message } = this.topic;

		if (!message?.returnValue) {
			return [];
		}

		return message.devices.map(this.mapDeviceToLaunchPoint);
	}

	private mapDeviceToLaunchPoint(device: Device): LaunchPoint {
		return {
			id: device.appId,
			launchPointId: device.appId,
			title: device.label,
			icon: `./root${device.iconPrefix}${device.icon}`,
			iconColor: '#ffffff',
			removable: false,
		};
	}
}
