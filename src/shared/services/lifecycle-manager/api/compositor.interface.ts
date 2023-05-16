import type { LunaMessage } from '../../luna';

export type AppLayer = {
	appId: string;
	primary: boolean;
	windowType: string;
};

export type ForegroundAppsMessage = LunaMessage<{
	foregroundApps: AppLayer[];
}>;
