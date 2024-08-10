import { promises } from 'fs';

import { Routine } from '../routine';

// eslint-disable-next-line import/extensions
import shadow from './shadow.source.js';

type KeyfilterConfigEntry = {
	file: string;
	handler: string;
};

export class KeyfilterRoutine extends Routine {
	public readonly id = 'keyfilter';

	private readonly targetHandlerId = 'handleSystemKeys';
	private readonly patchedHandlerPath = '/home/root/keyfilter-sysui-shadowed.js';

	public async apply() {
		const { keyFilters } = await this.readDefaultConfigSMLayer<{
			keyFilters: KeyfilterConfigEntry[];
		}>();

		const target = keyFilters.find(x => x.handler === this.targetHandlerId);

		if (!target) {
			throw new Error(
				`Target key filter entry not found (looking for ${this.targetHandlerId} handler)`,
			);
		}

		await this.deriveKeyfilter(target.file);

		target.file = this.patchedHandlerPath;

		await this.reconfigureKeyfilters(keyFilters);
	}

	private async readDefaultConfigSMLayer<T>() {
		return JSON.parse(
			await this.readFile('/etc/configd/layers/base/com.webos.surfacemanager.json'),
		) as T;
	}

	private async deriveKeyfilter(path: string) {
		const content = await this.readFile(path);

		const patched = `${content}\n${shadow}`;

		await this.writeFile(this.patchedHandlerPath, patched);
	}

	private async reconfigureKeyfilters(keyfilters: KeyfilterConfigEntry[]) {
		await this.service.oneshot('luna://com.webos.service.config/setConfigs', {
			configs: {
				'com.webos.surfacemanager.keyFilters': keyfilters,
			},
		});
	}

	private readFile(path: string): Promise<string> {
		return promises.readFile(path, { encoding: 'utf8' });
	}

	private writeFile(path: string, content: string) {
		return promises.writeFile(path, content, { encoding: 'utf8' });
	}
}
