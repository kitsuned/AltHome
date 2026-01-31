import { APP_ID, CANONICAL_HOME_APP_ID } from '../environment';
import { Routine } from '../routine';
import { exists, readConfigd, readJson, restartService, writeJson } from '../utils';

type MemoryManagerConfig = {
	KeepOnLaunchEx: string[];
	HomeGroup?: string[];
	[key: string]: any;
};

export class MemoryManagerRoutine extends Routine {
	public readonly id = 'memchute';

	private readonly legacyConfigSource = '/etc/palm/memorymanager-conf.json';

	public async apply() {
		if (await exists(this.legacyConfigSource)) {
			await this.rewireLegacyConfig();
		} else {
			await this.rewireConfig();
		}

		await restartService('memchute.service');
	}

	private async rewireConfig(): Promise<void> {
		const config = await readConfigd<MemoryManagerConfig>('com.webos.memorymanager');

		this.patchConfig(config);

		await this.service.oneshot('luna://com.webos.service.config/setConfigs', {
			configs: {
				'com.webos.memorymanager': config,
			},
		});
	}

	private async rewireLegacyConfig(): Promise<void> {
		const config = await readJson<MemoryManagerConfig>(this.legacyConfigSource);

		this.patchConfig(config);

		await writeJson('/home/root/memorymanager-conf.json', config);
	}

	private patchConfig(config: MemoryManagerConfig) {
		config.KeepOnLaunchEx = config.KeepOnLaunchEx.map(id =>
			id === CANONICAL_HOME_APP_ID ? APP_ID : id,
		);

		if (config.HomeGroup) {
			config.HomeGroup = [APP_ID];
		}
	}
}
