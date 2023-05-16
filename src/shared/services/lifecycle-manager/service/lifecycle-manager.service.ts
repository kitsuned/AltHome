import { makeAutoObservable, reaction } from 'mobx';

import { inject, injectable } from 'inversify';
import mitt from 'mitt';

import type { ActivateType } from 'shared/api/webos';

import { LunaTopic } from '../../luna';
import { SystemInfoService } from '../../system-info';
import type { ForegroundAppsMessage } from '../api/compositor.interface';
import type { LifecycleManagerEvents } from '../api/lifecycle-manager.interface';

@injectable()
export class LifecycleManagerService {
	public emitter = mitt<LifecycleManagerEvents>();

	private topic = new LunaTopic<ForegroundAppsMessage>(
		'luna://com.webos.service.applicationManager/getForegroundApps',
		{ extraInfo: true, subscribe: true },
	);

	private visible: boolean = true;

	public constructor(
		@inject(SystemInfoService) private readonly systemInfoService: SystemInfoService,
	) {
		makeAutoObservable(this, {}, { autoBind: true });

		reaction(
			() => this.topic.message,
			() => this.broadcastHide(),
		);

		document.addEventListener('webOSRelaunch', this.handleRelaunch);
	}

	public show() {
		this.visible = true;

		if (this.compositorShimsRequired) {
			webOSSystem.window.setFocus(true);
			webOSSystem.window.setInputRegion([document.body.getBoundingClientRect()]); // imagine trollface emoji here
		}
	}

	public hide() {
		this.visible = false;

		if (!this.compositorShimsRequired) {
			webOSSystem.hide();
			return;
		}

		webOSSystem.window.setFocus(false);
		webOSSystem.window.setInputRegion([{ x: 0, y: 0, width: 0, height: 0 }]);
	}

	public broadcastHide() {
		if (this.visible) {
			if (__DEV__) {
				console.log('broadcasting hide request...');
			}

			this.emitter.emit('requestHide');
		}
	}

	private get compositorShimsRequired() {
		return this.systemInfoService.osMajorVersion && this.systemInfoService.osMajorVersion < 7;
	}

	private get isLayerVisible(): boolean {
		return this.topic.message?.returnValue
			? this.topic.message.foregroundApps.some(({ appId }) => appId === process.env.APP_ID)
			: false;
	}

	private handleRelaunch(event: CustomEvent<ActivateType>) {
		if (event.detail?.intent) {
			this.emitter.emit('intent', event.detail.intent);
		} else {
			this.emitter.emit('relaunch');
		}
	}
}
