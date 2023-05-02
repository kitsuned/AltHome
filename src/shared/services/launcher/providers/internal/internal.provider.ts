import { injectable } from 'inversify';

import { ActivateType, Intent } from 'shared/api/webos.d';

import { LaunchPoint } from '../..';
import { LaunchPointsProvider } from '../launch-points.provider';

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
