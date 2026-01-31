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
		return this.osVersionParts ? this.osVersionParts[0] : null;
	}

	public get osMinorVersion(): number | null {
		return this.osVersionParts ? this.osVersionParts[1] : null;
	}

	private get osVersionParts(): [number, number, number] | null {
		return this.sdkVersion
			? (this.sdkVersion.split('.').map(x => Number(x)) as [number, number, number])
			: null;
	}
}
