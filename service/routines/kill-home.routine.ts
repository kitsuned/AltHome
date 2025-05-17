import { CANONICAL_HOME_APP_ID } from '../environment';
import { Routine } from '../routine';
import { killProcess } from '../utils';

export class KillHomeRoutine extends Routine {
	public readonly id = 'kill-home';

	public async apply() {
		await killProcess(CANONICAL_HOME_APP_ID);
	}
}
