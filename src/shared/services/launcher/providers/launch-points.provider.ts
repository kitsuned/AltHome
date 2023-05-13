import { injectable } from 'inversify';

import type { LaunchPointInput } from '../api/launch-point.interface';

@injectable()
export abstract class LaunchPointsProvider {
	public abstract get fulfilled(): boolean;

	public abstract get launchPoints(): LaunchPointInput[];
}
