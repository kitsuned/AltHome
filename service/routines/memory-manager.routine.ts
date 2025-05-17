import { APP_ID } from '../environment';
import { Routine } from '../routine';
import { asyncSpawn, readJson, writeJson } from '../utils';

type MemoryManagerConfig = {
	KeepOnLaunchEx: string[];
	[key: string]: any;
};

const CANONICAL_HOME_APP_ID = 'com.webos.app.home';

export class MemoryManagerRoutine extends Routine {
	public readonly id = 'memchute';

	public async apply() {
		const config = await readJson<MemoryManagerConfig>('/etc/palm/memorymanager-conf.json');

		config.KeepOnLaunchEx = config.KeepOnLaunchEx.map(id =>
			id === CANONICAL_HOME_APP_ID ? APP_ID : id,
		);

		await writeJson('/home/root/memorymanager-conf.json', config);

		await asyncSpawn('systemctl', ['--no-block', 'restart', 'memchute.service']);

		try {
			await asyncSpawn('killall', [CANONICAL_HOME_APP_ID]);
		} catch {
			console.warn(`${CANONICAL_HOME_APP_ID} was dead`);
		}
	}
}
