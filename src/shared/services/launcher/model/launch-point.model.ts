import { getEnv, types } from 'mobx-state-tree';

import type { LaunchPointInput, LaunchPointInstance } from '../api/launch-point.interface';

import type { LauncherService } from './launcher.service';

type Environment = {
	launcherService: LauncherService;
};

const UnprocessedLaunchPoint = types
	.model('LaunchPoint', {
		appId: types.string,
		title: types.string,
		launchPointId: types.identifier,

		removable: types.boolean,
		iconColor: types.string,
		icon: types.string,

		params: types.map(types.frozen()),
	})
	.actions(self => {
		const { launcherService } = getEnv<Environment>(self);

		return {
			launch: () => launcherService.launch(self as LaunchPointInstance),
			hide: () => launcherService.hide(self as LaunchPointInstance),
			uninstall: () => launcherService.uninstall(self as LaunchPointInstance),
		};
	});

export const LaunchPoint = types.snapshotProcessor(UnprocessedLaunchPoint, {
	preProcessor: (snapshot: LaunchPointInput) => ({
		...snapshot,
		appId: snapshot.id,
		icon:
			snapshot.mediumLargeIcon ||
			snapshot.largeIcon ||
			snapshot.extraLargeIcon ||
			snapshot.icon,
	}),
});
