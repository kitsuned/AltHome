import { makeAutoObservable } from 'mobx';

import { inject, injectable, multiInject } from 'inversify';

import { luna } from 'shared/services/luna';
import { SettingsService } from 'shared/services/settings';

import { LaunchPoint } from '..';
import { LaunchPointsProvider } from '../providers';

@injectable()
export class LauncherService {
	public constructor(
		@inject(SettingsService) private settingsService: SettingsService,
		@multiInject(LaunchPointsProvider) private readonly providers: LaunchPointsProvider[],
	) {
		makeAutoObservable(this, { launch: false }, { autoBind: true });
	}

	public get fulfilled() {
		return this.providers.every(x => x.fulfilled);
	}

	public get launchPoints(): LaunchPoint[] {
		return this.providers.flatMap(x => x.launchPoints);
	}

	public async launch({ id, params }: Pick<LaunchPoint, 'id' | 'params'>) {
		return luna('luna://com.webos.service.applicationmanager/launch', {
			id,
			params,
		});
	}

	public hide({ id }: Pick<LaunchPoint, 'id'>) {
		this.settingsService.order = this.settingsService.order.filter(x => x !== id);
	}

	public async uninstall({ id }: Pick<LaunchPoint, 'id'>) {
		this.hide({ id });
		// this.availableLaunchPoints.delete(id);

		return luna('luna://com.webos.appInstallService/remove', {
			id,
		});
	}
}
