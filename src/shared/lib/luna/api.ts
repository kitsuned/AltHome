import { LunaClient } from './client';

import type { LaunchPoint } from './api.interface';

export class LunaAPI {
	public static async launch(id: string) {
		await new LunaClient('luna://com.webos.service.applicationmanager/launch', {
			id,
		}).call();
	}

	public static async listLaunchPoints() {
		const { launchPoints } = await new LunaClient('luna://com.webos.service.applicationmanager/listLaunchPoints')
			.call<{ launchPoints: LaunchPoint[] }>();

		return launchPoints;
	}

	public static async moveLaunchPoint(id: string, position: number) {
		await new LunaClient('luna://com.webos.service.applicationmanager/moveLaunchPoint', {
			launchPointId: id,
			position,
		}).call();
	}

	public static async removeApp(id: string) {
		await new LunaClient('luna://com.webos.appInstallService/remove', {
			id,
		}).call();
	}
}
