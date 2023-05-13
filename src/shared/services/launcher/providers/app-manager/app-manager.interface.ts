import type { LunaMessage } from 'shared/services/luna';

import type { LaunchPointInput } from '../../api/launch-point.interface';

type LaunchPointChangeMixin = {
	change: 'added' | 'removed' | 'updated';
};

type LaunchPointsListMessage = {
	launchPoints: LaunchPointInput[];
};

type LaunchPointMutationMessage = LaunchPointInput & LaunchPointChangeMixin;

export type AppManagerMessage = LunaMessage<LaunchPointsListMessage | LaunchPointMutationMessage>;
