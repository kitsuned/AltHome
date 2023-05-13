import { makeAutoObservable } from 'mobx';

import { inject, injectable, multiInject } from 'inversify';

import { luna } from 'shared/services/luna';
import { SettingsService } from 'shared/services/settings';

import type { LaunchPointFactory, LaunchPointInstance } from '../api/launch-point.interface';
import { launchPointFactorySymbol } from '../launcher.tokens';
import { LaunchPointsProvider } from '../providers';

@injectable()
export class LauncherService {
	public constructor(
		@inject(SettingsService) private settingsService: SettingsService,
		@inject(launchPointFactorySymbol) private launchPointFactory: LaunchPointFactory,
		@multiInject(LaunchPointsProvider) private readonly providers: LaunchPointsProvider[],
	) {
		makeAutoObservable(this, {}, { autoBind: true });
	}

	public get fulfilled() {
		return this.providers.every(x => x.fulfilled);
	}

	public get launchPoints(): LaunchPointInstance[] {
		return this.providers.flatMap(x => x.launchPoints).map(this.launchPointFactory);
	}

	public async launch({ appId, params }: LaunchPointInstance) {
		return luna('luna://com.webos.service.applicationManager/launch', { id: appId, params });
	}

	public hide({ launchPointId }: LaunchPointInstance) {
		this.settingsService.order = this.settingsService.order.filter(x => x !== launchPointId);
	}

	public async uninstall(lp: LaunchPointInstance) {
		this.hide(lp);

		return luna('luna://com.webos.appInstallService/remove', { id: lp.appId });
	}
}
