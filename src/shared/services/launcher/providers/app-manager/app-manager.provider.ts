import { comparer, makeAutoObservable, observable, reaction } from 'mobx';

import { injectable } from 'inversify';

import { LunaTopic } from 'shared/services/luna';

import type { LaunchPointInput } from '../../api/launch-point.interface';
import type { LaunchPointsProvider } from '../launch-points.provider';

import type { AppManagerMessage } from './app-manager.interface';

@injectable()
export class AppManagerProvider implements LaunchPointsProvider {
	public launchPoints: LaunchPointInput[] = observable.array([], { equals: comparer.structural });

	private topic = new LunaTopic<AppManagerMessage>(
		'luna://com.webos.service.applicationManager/listLaunchPoints',
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
			this.launchPoints = message.launchPoints;

			return;
		}

		if (!('change' in message)) {
			return;
		}

		const { change } = message;

		if (change === 'added') {
			this.launchPoints.push(message);
		}

		const ref = this.launchPoints.find(x => x.id === message.id);

		if (!ref) {
			console.warn(`Unable to find referenced launch point: ${message.id}`);
			return;
		}

		if (change === 'updated') {
			Object.assign(ref, message);
		}

		if (change === 'removed') {
			this.launchPoints = this.launchPoints.filter(x => ref !== x);
		}
	}
}
