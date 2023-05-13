import type { Instance } from 'mobx-state-tree';

import type { LaunchPoint } from '../model/launch-point.model';

export type LaunchPointInput = {
	id: string;
	title: string;

	launchPointId: string;

	removable: boolean;
	iconColor: string;

	icon: string;
	mediumLargeIcon?: string;
	largeIcon?: string;
	extraLargeIcon?: string;

	params?: Record<string, any>;
};

export type LaunchPointInstance = Instance<typeof LaunchPoint>;

export type LaunchPointFactory = (snapshot: LaunchPointInput) => LaunchPointInstance;
