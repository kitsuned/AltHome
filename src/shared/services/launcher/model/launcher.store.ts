import { makeAutoObservable, reaction } from 'mobx';

import { luna, LunaTopic } from 'shared/services/luna';

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
	public launchPoints: LaunchPoint[] = [];

	private launchPointsMessage = new LunaTopic<ListLaunchPointsMessage>('luna://com.webos.service.applicationmanager/listLaunchPoints');

	public constructor() {
		makeAutoObservable(this, { launch: false }, { autoBind: true });

		reaction(() => this.launchPointsMessage.message, this.handleMessage);
	}

	public async launch({ id }: LaunchPoint) {
		return luna('luna://com.webos.service.applicationmanager/launch', {
			id,
		});
	}

	public async move(launchPoint: LaunchPoint, position: number) {
		this.optimisticMove(launchPoint, position);

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

	private optimisticMove(launchPoint: LaunchPoint, position: number) {
		const from = this.launchPoints.indexOf(launchPoint);

		if (from !== position) {
			this.launchPoints.splice(from, 1);
			this.launchPoints.splice(position, 0, launchPoint);
		}
	}

	private handleMessage() {
		const { message } = this.launchPointsMessage;

		if (!message) {
			return;
		}

		if ('launchPoints' in message) {
			this.launchPoints = message.launchPoints.filter(x => x.id !== process.env.APP_ID);
		}

		if (!('change' in message)) {
			return;
		}

		if (message.change === 'added') {
			this.launchPoints.push(message);
		}

		if (message.change === 'removed') {
			this.launchPoints = this.launchPoints.filter(x => x.id !== message.id);
		}

		if (message.change === 'updated') {
			const curr = this.launchPoints.find(x => x.id === message.id)!;

			if (message.changeReason !== 'movedByUser') {
				Object.assign(curr, message);
			} else {
				this.optimisticMove(curr, message.position);
			}
		}
	}
}

export const launcherStore = new LauncherStore();
