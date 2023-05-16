import { autorun, keys, makeAutoObservable, observable } from 'mobx';
import type { ObservableMap } from 'mobx';

import { inject, injectable, multiInject } from 'inversify';

import { luna } from 'shared/services/luna';
import { SettingsService } from 'shared/services/settings';

import { LifecycleManagerService } from '../../lifecycle-manager';
import type { LaunchPointFactory, LaunchPointInstance } from '../api/launch-point.interface';
import { launchPointFactorySymbol } from '../launcher.tokens';
import { LaunchPointsProvider } from '../providers';

@injectable()
export class LauncherService {
	private readonly launchPointsMap = observable.map<string, LaunchPointInstance>();

	public constructor(
		@inject(SettingsService) private readonly settingsService: SettingsService,
		@inject(LifecycleManagerService) private readonly lifecycleManager: LifecycleManagerService,
		@inject(launchPointFactorySymbol) private readonly launchPointFactory: LaunchPointFactory,
		@multiInject(LaunchPointsProvider) private readonly providers: LaunchPointsProvider[],
	) {
		makeAutoObservable<LauncherService, 'pickByIds'>(
			this,
			{ pickByIds: false },
			{ autoBind: true },
		);

		autorun(() => {
			this.launchPointsMap.replace(this.launchPoints.map(lp => [lp.launchPointId, lp]));
		});

		if (__DEV__) {
			autorun(() => {
				console.log({
					visible: this.visible.map(x => toJS(x)),
					hidden: this.hidden.map(x => toJS(x)),
				});
			});
		}
	}

	public get fulfilled() {
		return this.providers.every(x => x.fulfilled);
	}

	public get launchPoints(): LaunchPointInstance[] {
		return this.providers.flatMap(x => x.launchPoints).map(this.launchPointFactory);
	}

	public get visible() {
		return this.pickByIds([...this.order, '@intent:add_apps']);
	}

	public get hidden() {
		return this.pickByIds(this.hiddenIds);
	}

	public async launch({ appId, params }: LaunchPointInstance) {
		this.lifecycleManager.broadcastHide();

		return luna('luna://com.webos.service.applicationManager/launch', { id: appId, params });
	}

	public hide({ launchPointId }: LaunchPointInstance) {
		this.order = this.order.filter(x => x !== launchPointId);
	}

	public async uninstall(lp: LaunchPointInstance) {
		this.hide(lp);

		return luna('luna://com.webos.appInstallService/remove', { id: lp.appId });
	}

	public move(lp: LaunchPointInstance, shift: number) {
		console.log(lp.appId, shift);

		const from = this.visible.indexOf(lp);
		const to = from + shift;

		if (to < 0 || to > this.visible.length - 1) {
			return;
		}

		if (from !== to) {
			const ids = this.visible.map(x => x.launchPointId);

			ids.splice(from, 1);
			ids.splice(to, 0, lp.launchPointId);

			this.order = ids;
		}
	}

	private get order() {
		return this.settingsService.order.filter(x => !x.startsWith('@'));
	}

	private set order(value: string[]) {
		this.settingsService.order = value;
	}

	private get hiddenIds() {
		return keys(this.launchPointsMap as ObservableMap<string>).filter(
			id => !this.order.includes(id) && id.startsWith('@'),
		);
	}

	private pickByIds(ids: string[]): LaunchPointInstance[] {
		return ids
			.map(id => this.launchPointsMap.get(id))
			.filter((lp): lp is LaunchPointInstance => Boolean(lp));
	}
}
