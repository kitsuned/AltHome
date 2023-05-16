import { getEnv, types } from 'mobx-state-tree';

import type { LaunchPointInput, LaunchPointInstance } from '../api/launch-point.interface';

import type { LauncherService } from './launcher.service';

type Environment = {
	launcherService: LauncherService;
};

const normalizeIcon = (path: string) => (path.startsWith('/') ? `./root${path}` : path);

const UnprocessedLaunchPoint = types
	.model('LaunchPoint', {
		appId: types.string,
		title: types.string,
		launchPointId: types.identifier,

		builtin: types.optional(types.boolean, false),
		removable: types.boolean,
		iconColor: types.string,
		icon: types.string,
	})
	.volatile(() => ({
		params: {},
	}))
	.actions(self => {
		const { launcherService } = getEnv<Environment>(self);

		return {
			launch: () => launcherService.launch(self as LaunchPointInstance),
			move: (shift: number) => launcherService.move(self as LaunchPointInstance, shift),
			hide: () => launcherService.hide(self as LaunchPointInstance),
			uninstall: () => launcherService.uninstall(self as LaunchPointInstance),
		};
	});

export const LaunchPoint = types.snapshotProcessor(UnprocessedLaunchPoint, {
	preProcessor: (snapshot: LaunchPointInput) => ({
		...snapshot,
		appId: snapshot.id,
		icon: normalizeIcon(
			snapshot.mediumLargeIcon ||
				snapshot.largeIcon ||
				snapshot.extraLargeIcon ||
				snapshot.icon,
		),
	}),
});
