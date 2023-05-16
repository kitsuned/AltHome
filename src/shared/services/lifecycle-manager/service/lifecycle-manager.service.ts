import { makeAutoObservable } from 'mobx';

import { inject, injectable } from 'inversify';

import { LunaTopic } from '../../luna';
import { SystemInfoService } from '../../system-info';
import type { ForegroundAppsMessage } from '../api/compositor.interface';

@injectable()
export class LifecycleManagerService {
	private topic = new LunaTopic<ForegroundAppsMessage>(
		'luna://com.webos.service.applicationManager/getForegroundApps',
		{ extraInfo: true, subscribe: true },
	);

	public constructor(
		@inject(SystemInfoService) private readonly systemInfoService: SystemInfoService,
	) {
		makeAutoObservable(this, {}, { autoBind: true });
	}

	public show() {
		if (this.compositorShimsRequired) {
			webOSSystem.window.setFocus(true);
			webOSSystem.window.setInputRegion([document.body.getBoundingClientRect()]); // imagine trollface emoji here
		}
	}

	public hide() {
		if (!this.compositorShimsRequired) {
			webOSSystem.hide();
			return;
		}

		webOSSystem.window.setFocus(false);
		webOSSystem.window.setInputRegion([{ x: 0, y: 0, width: 0, height: 0 }]);
	}

	private get compositorShimsRequired() {
		return this.systemInfoService.osMajorVersion && this.systemInfoService.osMajorVersion < 7;
	}

	private get isLayerVisible(): boolean {
		return this.topic.message?.returnValue
			? this.topic.message.foregroundApps.some(({ appId }) => appId === process.env.APP_ID)
			: false;
	}

	private handleIntent() {
		//
	}
}
