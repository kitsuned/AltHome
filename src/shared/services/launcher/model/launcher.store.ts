import { makeAutoObservable, observable, reaction, when } from 'mobx';

import { luna, LunaTopic } from 'shared/services/luna';
import { settingsStore } from 'shared/services/settings';

import type { LaunchPoint, LaunchPointIconsMixin } from '../api/launch-point';

type ListLaunchPointsMessage = {
	launchPoints: (LaunchPoint & LaunchPointIconsMixin)[];
} | (
	LaunchPoint & LaunchPointIconsMixin & ({
	change: 'added' | 'removed';
} | {
	change: 'updated';
	changeReason: 'movedByUser' | string;
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
					settingsStore.order = Array.from(this.availableLaunchPoints.keys())
						.filter(id => !id.startsWith('com.webos'));
				}

				if (settingsStore.order.length === 0) {
					settingsStore.order = Array.from(this.availableLaunchPoints.keys());
				}
			},
		);
	}

	public get launchPoints(): LaunchPoint[] {
		return settingsStore.order
			.map(id => this.availableLaunchPoints.get(id))
			.filter((lp): lp is LaunchPoint => lp !== undefined);
	}

	public async launch({ id, params }: Pick<LaunchPoint, 'id' | 'params'>) {
		return luna('luna://com.webos.service.applicationmanager/launch', {
			id,
			params,
		});
	}

	public hide({ id }: Pick<LaunchPoint, 'id'>) {
		settingsStore.order = settingsStore.order.filter(x => x !== id);
	}

	public async uninstall({ id }: Pick<LaunchPoint, 'id'>) {
		this.hide({ id });
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
			this.availableLaunchPoints.replace(message.launchPoints.map(x => [
				x.id,
				this.normalizeLaunchPoint(x),
			]));
		}

		if (!('change' in message)) {
			return;
		}

		if (message.change === 'added') {
			this.availableLaunchPoints.set(message.id, this.normalizeLaunchPoint(message));

			if (settingsStore.addNewApps) {
				settingsStore.order.push(message.id);
			}
		}

		if (message.change === 'updated' && message.changeReason !== 'movedByUser') {
			this.availableLaunchPoints.set(message.id, this.normalizeLaunchPoint(message));
		}

		if (message.change === 'removed') {
			this.availableLaunchPoints.delete(message.id);
		}
	}

	private normalizeLaunchPoint(lp: LaunchPoint & LaunchPointIconsMixin): LaunchPoint {
		lp.icon = lp.mediumLargeIcon || lp.largeIcon || lp.extraLargeIcon || lp.icon;

		if (lp.icon.startsWith('/')) {
			lp.icon = `./root${lp.icon}`;
		}

		return lp;
	}
}

export const launcherStore = new LauncherStore();
