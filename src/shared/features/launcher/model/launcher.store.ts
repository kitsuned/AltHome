import { makeAutoObservable, reaction } from 'mobx';

import { luna, LunaTopic } from 'shared/services/luna';

import { LaunchPoint } from '../api/launch-point';

type ListLaunchPointsMessage = {
	launchPoints: LaunchPoint[];
} | (LaunchPoint & ({
	change: 'removed';
	changeReason: 'appUninstalled';
} | {
	change: 'updated';
	changeReason: 'movedByUser' | string;
	position: number;
}));

class LauncherStore {
	public launchPoints: LaunchPoint[] = [];

	private launchPointsMessage = new LunaTopic<ListLaunchPointsMessage>('luna://com.webos.service.applicationmanager/listLaunchPoints', {
		subscribe: true,
	});

	public constructor() {
		makeAutoObservable(
			this,
			{
				launch: false,
				move: false,
				uninstall: false,
			},
			{ autoBind: true },
		);

		reaction(() => this.launchPointsMessage.message, this.handleMessage);
	}

	public async launch({ id }: LaunchPoint) {
		return luna('luna://com.webos.service.applicationmanager/launch', {
			id,
		});
	}

	public async move({ launchPointId }: LaunchPoint, position: number) {
		return luna('luna://com.webos.service.applicationmanager/moveLaunchPoint', {
			launchPointId,
			position,
		});
	}

	public async uninstall({ id }: LaunchPoint) {
		return luna('luna://com.webos.appInstallService/remove', {
			id,
		})
	}

	private handleMessage() {
		const message = this.launchPointsMessage.message;

		if (!message) {
			return;
		}

		if ('launchPoints' in message) {
			this.launchPoints = message.launchPoints.filter(x => x.id !== process.env.APP_ID);
		}

		if (!('change' in message)) {
			return;
		}

		if (message.change === 'removed') {
			this.launchPoints = this.launchPoints.filter(x => x.launchPointId !== message.launchPointId);
		}

		if (message.change === 'updated' && message.changeReason === 'movedByUser') {
			const from = this.launchPoints.findIndex(x => x.launchPointId === message.launchPointId);

			this.launchPoints.splice(from, 1);
			this.launchPoints.splice(message.position, 0, message);
		}
	}
}

export const launcherStore = new LauncherStore();
