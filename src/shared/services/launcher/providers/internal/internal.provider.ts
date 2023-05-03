import { injectable } from 'inversify';

import { Intent } from 'shared/api/webos.d';
import type { ActivateType } from 'shared/api/webos.d';

import type { LaunchPoint } from '../..';
import type { LaunchPointsProvider } from '../launch-points.provider';

import plus from 'assets/plus.png';

@injectable()
export class InternalProvider implements LaunchPointsProvider {
	public fulfilled = true;

	public launchPoints = [
		<LaunchPoint>{
			id: 'com.kitsuned.althome',
			launchPointId: '@intent:add_apps',
			title: 'Add apps',
			removable: false,
			iconColor: '#242424',
			icon: plus,
			params: <ActivateType>{
				intent: Intent.AddApps,
			},
		},
	];
}
