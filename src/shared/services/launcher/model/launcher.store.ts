import { makeAutoObservable, observable, reaction, when } from 'mobx';

import { luna, LunaTopic } from 'shared/services/luna';
import { settingsStore } from 'shared/services/settings';

import type { LaunchPoint } from '../api/launch-point';

type ListLaunchPointsMessage = {
	launchPoints: LaunchPoint[];
} | (
	LaunchPoint & ({
	change: 'added' | 'removed';
} | {
	change: 'updated';
	changeReason: 'movedByUser' | string;
	position: number;
}));

class LauncherStore {
	public availableLaunchPoints = observable.map<string, LaunchPoint>();

	private launchPointsMessage = new LunaTopic<ListLaunchPointsMessage>('luna://com.webos.service.applicationmanager/listLaunchPoints');

	public constructor() {
		makeAutoObservable(this, { launch: false }, { autoBind: true });

		reaction(() => this.launchPointsMessage.message, this.handleMessage);

		when(
			() => settingsStore.hydrated && Boolean(this.launchPointsMessage.message),
			() => {
				if (settingsStore.order.length === 0) {
					settingsStore.order = this.launchPoints.map(x => x.id)
						.filter(id => !id.startsWith('com.webos'));
				}

				if (settingsStore.order.length === 0) {
					settingsStore.order = this.launchPoints.map(x => x.id);
				}
			},
		);
	}

	public get launchPoints(): LaunchPoint[] {
		return settingsStore.order
			.map(id => this.availableLaunchPoints.get(id))
			.filter((lp): lp is LaunchPoint => lp !== undefined);
	}

	public async launch({ id }: LaunchPoint) {
		return luna('luna://com.webos.service.applicationmanager/launch', {
			id,
		});
	}

	public async move({ id }: LaunchPoint, position: number) {
		const from = settingsStore.order.indexOf(id);

		if (from !== position) {
			settingsStore.order.splice(from, 1);
			settingsStore.order.splice(position, 0, id);
		}
	}

	public async uninstall({ id }: LaunchPoint) {
		this.availableLaunchPoints.delete(id);

		return luna('luna://com.webos.appInstallService/remove', {
			id,
		});
	}

	private handleMessage() {
		const { message } = this.launchPointsMessage;

		if (!message) {
			return;
		}

		if ('launchPoints' in message) {
			this.availableLaunchPoints.replace(message.launchPoints.map(x => [x.id, x]));
		}

		if (!('change' in message)) {
			return;
		}

		if (message.change === 'added') {
			this.availableLaunchPoints.set(message.id, message);

			if (settingsStore.addNewApps) {
				settingsStore.order.push(message.id);
			}
		}

		if (message.change === 'updated') {
			this.availableLaunchPoints.set(message.id, message);
		}

		if (message.change === 'removed') {
			this.availableLaunchPoints.delete(message.id);
		}
	}
}

export const launcherStore = new LauncherStore();
