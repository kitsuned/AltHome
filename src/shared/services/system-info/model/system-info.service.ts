import { makeAutoObservable, runInAction } from 'mobx';

import { injectable } from 'inversify';

import { luna } from '../../luna';
import type { SystemInfoMessage } from '../api/system-info.interface';
import { systemInfoKeys } from '../lib/system-info-keys.lib';

@injectable()
export class SystemInfoService {
	public firmwareVersion: string | null = null;
	public modelName: string | null = null;
	public sdkVersion: string | null = null;

	public constructor() {
		makeAutoObservable(this, {}, { autoBind: true });

		void luna<SystemInfoMessage>('luna://com.webos.service.tv.systemproperty/getSystemInfo', {
			keys: systemInfoKeys,
		}).then(({ returnValue, ...rest }) => {
			if (returnValue) {
				runInAction(() => Object.assign(this, rest));
			}
		});
	}

	public get osMajorVersion(): number | null {
		return this.sdkVersion ? Number(this.sdkVersion.split('.', 1)[0]) : null;
	}
}
