import { comparer, makeAutoObservable, observable, reaction } from 'mobx';

import { injectable } from 'inversify';

import { LunaTopic } from 'shared/services/luna';

import { LaunchPoint } from '../..';
import { LaunchPointsProvider } from '../launch-points.provider';

import { AppManagerLaunchPoint, AppManagerMessage } from './app-manager.interface';
import { pick } from './app-manager.lib';

@injectable()
export class AppManagerProvider implements LaunchPointsProvider {
	public launchPoints: LaunchPoint[] = observable.array([], { equals: comparer.structural });

	private topic = new LunaTopic<AppManagerMessage>(
		'luna://com.webos.service.applicationmanager/listLaunchPoints',
	);

	public constructor() {
		makeAutoObservable(this, {}, { autoBind: true });

		reaction(() => this.topic.message!, this.handleMessage);
	}

	public get fulfilled(): boolean {
		return Boolean(this.topic.message);
	}

	private handleMessage(message: AppManagerMessage): void {
		if (!message.returnValue) {
			return;
		}

		if ('launchPoints' in message) {
			this.launchPoints = message.launchPoints.map(this.normalizeLaunchPoint);

			return;
		}

		if (!('change' in message)) {
			return;
		}

		const normalized = this.normalizeLaunchPoint(message);
		const { change } = message;

		if (change === 'added') {
			this.launchPoints.push(normalized);
		}

		const ref = this.launchPoints.find(x => x.id === message.id);

		if (!ref) {
			console.warn(`Unable to find referenced launch point: ${message.id}`);
			return;
		}

		if (change === 'updated') {
			Object.assign(ref, normalized);
		}

		if (change === 'removed') {
			this.launchPoints = this.launchPoints.filter(x => ref !== x);
		}
	}

	private normalizeLaunchPoint(lp: AppManagerLaunchPoint): LaunchPoint {
		const normalized: LaunchPoint = {
			...pick(lp, 'id', 'launchPointId', 'title', 'removable', 'iconColor', 'params'),
			icon: lp.mediumLargeIcon || lp.largeIcon || lp.extraLargeIcon || lp.icon,
		};

		if (normalized.icon.startsWith('/')) {
			normalized.icon = `./root${normalized.icon}`;
		}

		if (normalized.id === 'org.webosbrew.hbchannel') {
			normalized.removable = false;
		}

		return normalized;
	}
}
