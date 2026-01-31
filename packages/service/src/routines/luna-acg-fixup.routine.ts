import { APP_ID, SERVICE_ID } from '../environment';
import { Routine } from '../routine';
import { exists, rescanLunaManifests, writeFile } from '../utils';

// TODO should be handled by HBC elevator
export class LunaAcgFixupRoutine extends Routine {
	public readonly id = 'luna-acg-fixup';

	private readonly clientPermissions = {
		[`${APP_ID}-*`]: [
			'public',
			`${SERVICE_ID}.group`,
			'applications.launch',
			'applications.internal',
			'appinstalld.internal',
			'eim.deviceInfo',
			'notifications',
			'tv.settings',
		],
	};

	public async apply() {
		for (const root of ['/var/luna-service2-dev', '/var/luna-service2']) {
			const clientPermsPath = `${root}/client-permissions.d/${APP_ID}.app.json`;

			if (await exists(clientPermsPath)) {
				await writeFile(
					clientPermsPath,
					JSON.stringify(this.clientPermissions, null, '\t'),
				);
			}
		}

		await rescanLunaManifests();
	}
}
