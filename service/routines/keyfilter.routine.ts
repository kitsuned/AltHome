import { resolve } from 'path';

import { Routine } from '../routine';
import { readConfigd } from '../utils';

// @ts-ignore
// eslint-disable-next-line import/extensions
import keyfilterPath from './keyfilters/home.keyfilter.js';

type KeyfilterConfigEntry = {
	file: string;
	handler: string;
};

type SMPartialConfig = {
	keyFilters: KeyfilterConfigEntry[];
};

export class KeyfilterRoutine extends Routine {
	public readonly id = 'keyfilter';

	private readonly targetHandler = 'handleHomeKey';
	private readonly targetFile = resolve(keyfilterPath);

	public async apply() {
		const { keyFilters: keyfilters } = await readConfigd<SMPartialConfig>(
			'com.webos.surfacemanager',
		);

		await this.reconfigureKeyfilters([
			{
				handler: this.targetHandler,
				file: this.targetFile,
			},
			...keyfilters,
		]);
	}

	private async reconfigureKeyfilters(keyfilters: KeyfilterConfigEntry[]) {
		await this.service.oneshot('luna://com.webos.service.config/setConfigs', {
			configs: {
				'com.webos.surfacemanager.keyFilters': keyfilters,
			},
		});
	}
}
