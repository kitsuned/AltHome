import { APP_ID, CANONICAL_HOME_APP_ID } from '../environment';
import { Routine } from '../routine';
import { readJson, restartService, writeJson } from '../utils';

type MemoryManagerConfig = {
	KeepOnLaunchEx: string[];
	HomeGroup?: string[];
	[key: string]: any;
};

export class MemoryManagerRoutine extends Routine {
	public readonly id = 'memchute';

	public async apply() {
		await this.patchMemoryManagerConfig();

		await restartService('memchute.service');
	}

	public async patchMemoryManagerConfig() {
		const config = await readJson<MemoryManagerConfig>('/etc/palm/memorymanager-conf.json');

		config.KeepOnLaunchEx = config.KeepOnLaunchEx.map(id =>
			id === CANONICAL_HOME_APP_ID ? APP_ID : id,
		);

		if (config.HomeGroup) {
			config.HomeGroup = [APP_ID];
		}

		await writeJson('/home/root/memorymanager-conf.json', config);
	}
}
