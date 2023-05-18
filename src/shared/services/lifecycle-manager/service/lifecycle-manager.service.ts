import { makeAutoObservable, reaction } from 'mobx';

import { inject, injectable } from 'inversify';
import mitt from 'mitt';

import type { ActivateType } from 'shared/api/webos.d';
import { luna, LunaTopic } from 'shared/services/luna';
import { SystemInfoService } from 'shared/services/system-info';

import type { LifecycleEvent } from '../api/compositor.interface';
import type { LifecycleManagerEvents } from '../api/lifecycle-manager.interface';

@injectable()
export class LifecycleManagerService {
	public emitter = mitt<LifecycleManagerEvents>();

	private topic = new LunaTopic<LifecycleEvent>(
		'luna://com.webos.service.applicationManager/getAppLifeEvents',
	);

	private visible: boolean = true;

	public constructor(
		@inject(SystemInfoService) private readonly systemInfoService: SystemInfoService,
	) {
		makeAutoObservable(this, {}, { autoBind: true });

		reaction(
			() => this.topic.message,
			message => {
				if (
					message?.appId !== process.env.APP_ID &&
					(message?.event === 'splash' || message?.event === 'launch')
				) {
					this.broadcastHide();
				}
			},
		);

		document.addEventListener('webOSRelaunch', this.handleRelaunch);
	}

	public show() {
		this.visible = true;

		webOSSystem.activate();
	}

	public hide() {
		this.visible = false;

		if (this.compositorShimsRequired) {
			this.requestSuspense();
		} else {
			webOSSystem.hide();
		}
	}

	public broadcastHide() {
		if (this.visible) {
			if (__DEV__) {
				console.log('broadcasting hide request');
			}

			this.emitter.emit('requestHide');
		}
	}

	private get compositorShimsRequired() {
		if (this.systemInfoService.osMajorVersion === 7) {
			return this.systemInfoService.osMinorVersion! < 3;
		}

		return this.systemInfoService.osMajorVersion
			? this.systemInfoService?.osMajorVersion < 7
			: true;
	}

	private handleRelaunch(event: CustomEvent<ActivateType>) {
		if (event.detail?.intent) {
			if (__DEV__) {
				console.log('broadcasting intent', event.detail);
			}

			this.emitter.emit('intent', event.detail.intent);
		} else if (event.detail?.activateType === 'home' && !this.visible) {
			this.emitter.emit('relaunch');
		} else if (this.visible) {
			this.emitter.emit('requestHide');
		}
	}

	private requestSuspense() {
		void luna('luna://com.webos.service.applicationManager/suspense', {
			id: process.env.APP_ID,
		});
	}
}
