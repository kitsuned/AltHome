import { injectable } from 'inversify';

import plus from 'assets/plus.png';
import { Intent, type ActivateType } from 'shared/api/common';
import type { LaunchPointInput } from '../../api/launch-point.interface';
import type { LaunchPointsProvider } from '../launch-points.provider';

@injectable()
export class InternalProvider implements LaunchPointsProvider {
	public fulfilled = true;

	public launchPoints = [
		<LaunchPointInput>{
			id: 'com.kitsuned.althome',
			launchPointId: '@intent:add_apps',
			title: 'Add apps',
			builtin: true,
			removable: false,
			iconColor: '#242424',
			icon: plus,
			params: <ActivateType>{
				intent: Intent.AddApps,
			},
		},
	];
}
