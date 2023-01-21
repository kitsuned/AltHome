import type { LunaAPI as TrueLunaAPI } from './api';

import type { LaunchPoint } from './api.interface';

export class LunaAPI implements TrueLunaAPI {
	public static async listLaunchPoints() {
		return Array.from({ length: 30 }).map((_, i) => (<LaunchPoint>{
			id: `id${i}`,
			iconColor: `hsl(${i * 30}deg 100% 50%)`,
		}));
	}

	public static async launch(id: string) {
		console.log('[dev] launch', id);
	}
}
