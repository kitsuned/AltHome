import { makeAutoObservable, reaction } from 'mobx';

import { luna, LunaTopic } from 'shared/services/luna';

import { LaunchPoint } from '../api/launch-point';

type ListLaunchPointsMessage = {
	launchPoints?: LaunchPoint[];
};

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

	public async move(launchPoint: LaunchPoint, position: number) {
		const from = this.launchPoints.indexOf(launchPoint);

		this.launchPoints.splice(from, 1);
		this.launchPoints.splice(position, 0, launchPoint);

		return luna('luna://com.webos.service.applicationmanager/moveLaunchPoint', {
			launchPointId: launchPoint.launchPointId,
			position,
		});
	}

	public async uninstall({ id }: LaunchPoint) {
		this.launchPoints = this.launchPoints.filter(x => x.id !== id);

		return luna('luna://com.webos.appInstallService/remove', {
			id,
		});
	}

	private handleMessage() {
		const { message } = this.launchPointsMessage;

		if (message?.launchPoints) {
			this.launchPoints = message.launchPoints.filter(x => x.id !== process.env.APP_ID);
		}
	}
}

export const launcherStore = new LauncherStore();
