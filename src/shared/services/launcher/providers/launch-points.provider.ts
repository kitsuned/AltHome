import { injectable } from 'inversify';

import { LaunchPoint } from '..';

@injectable()
export abstract class LaunchPointsProvider {
	public abstract get fulfilled(): boolean;

	public abstract get launchPoints(): LaunchPoint[];
}
