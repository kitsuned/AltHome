import { makeAutoObservable, reaction } from 'mobx';

import { inject, injectable } from 'inversify';
import mitt from 'mitt';

import type { ActivateType } from 'shared/api/webos';

import { luna, LunaTopic } from '../../luna';
import { SystemInfoService } from '../../system-info';
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
	}

	public hide() {
		this.visible = false;

		if (!this.compositorShimsRequired) {
			webOSSystem.hide();
		} else {
			this.requestSuspense();
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
			? this.systemInfoService?.osMajorVersion > 7
			: true;
	}

	private handleRelaunch(event: CustomEvent<ActivateType>) {
		if (event.detail?.intent) {
			this.emitter.emit('intent', event.detail.intent);
		} else {
			this.emitter.emit('relaunch');
		}
	}

	private requestSuspense() {
		if (__DEV__) {
			console.log('requesting suspense');
		}

		void luna('luna://com.webos.service.applicationManager/pause', {
			id: process.env.APP_ID,
		});
	}
}
