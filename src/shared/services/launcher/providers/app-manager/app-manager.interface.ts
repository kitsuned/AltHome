import { LunaMessage } from 'shared/services/luna';

import { LaunchPoint, LaunchPointIconsMixin } from '../..';

export type AppManagerLaunchPoint = LaunchPoint & LaunchPointIconsMixin;

type LaunchPointChangeMixin = {
	change: 'added' | 'removed' | 'updated';
};

type LaunchPointsListMessage = {
	launchPoints: AppManagerLaunchPoint[];
};

type LaunchPointMutationMessage = AppManagerLaunchPoint & LaunchPointChangeMixin;

export type AppManagerMessage = LunaMessage<LaunchPointsListMessage | LaunchPointMutationMessage>;
