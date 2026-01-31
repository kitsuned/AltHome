import { computed, makeObservable } from 'mobx';

import { injectable } from 'inversify';

import { LunaTopic } from '../../../luna';
import type { LaunchPointInput } from '../../api/launch-point.interface';
import type { LaunchPointsProvider } from '../launch-points.provider';

import type { Device, InputManagerMessage } from './input-manager.interface';

@injectable()
export class InputProvider implements LaunchPointsProvider {
	private topic = new LunaTopic<InputManagerMessage>(
		'luna://com.webos.service.eim/getAllInputStatus',
	);

	public constructor() {
		makeObservable(
			this,
			{ fulfilled: computed, launchPoints: computed.struct },
			{ autoBind: true },
		);
	}

	public get fulfilled(): boolean {
		return Boolean(this.topic.message!);
	}

	public get launchPoints(): LaunchPointInput[] {
		const { message } = this.topic;

		if (!message?.returnValue) {
			return [];
		}

		return (message.devices as Device[])
			.filter(this.isPhysicalDevice)
			.map(this.mapDeviceToLaunchPoint);
	}

	private isPhysicalDevice(device: Device): boolean {
		return !('mvpdIcon' in device || 'pigImage' in device);
	}

	private mapDeviceToLaunchPoint(device: Device): LaunchPointInput {
		const icon = device.iconPrefix ? device.iconPrefix + device.icon : device.icon;

		return {
			id: device.appId,
			launchPointId: device.appId,
			title: device.label,
			icon: `./root${icon}`,
			iconColor: '#ffffff',
			removable: false,
		};
	}
}
