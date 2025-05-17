import { APP_ID, CANONICAL_HOME_APP_ID } from '../environment';
import { Routine } from '../routine';
import { asyncSpawn, readJson } from '../utils';

type AppPolicy = {
	id: string;
	preloadMode: string;
	isEnabled: boolean;
	[key: string]: any;
};

type PreloadManagerConfigLayer = {
	supportAppList: AppPolicy[];
};

export class PreloadManagerRoutine extends Routine {
	public readonly id = 'preload';

	public async apply() {
		await this.patchAppPoliciesConfig();

		await asyncSpawn('systemctl', ['--no-block', 'restart', 'preload-manager.service']);
	}

	public async patchAppPoliciesConfig() {
		const { supportAppList: apps } = await readJson<PreloadManagerConfigLayer>(
			'/etc/configd/layers/base/com.webos.service.preloadmanager.json',
		);

		// TODO preloadMode: partial, semi-full, full, criu (???)
		const patched = apps.map(app =>
			app.id !== CANONICAL_HOME_APP_ID
				? app
				: {
						...app,
						id: APP_ID,
						preloadMode: 'partial',
				  },
		);

		await this.service.oneshot('luna://com.webos.service.config/setConfigs', {
			configs: {
				'com.webos.service.preloadmanager.supportAppList': patched,
			},
		});
	}
}
