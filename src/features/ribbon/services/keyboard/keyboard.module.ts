import { ContainerModule } from 'inversify';

import { KeyboardService } from './keyboard.service';
import { TimerRef } from './timer-ref';

export const keyboardModule = new ContainerModule(options => {
	options.bind(KeyboardService).toSelf().inTransientScope();
	options.bind(TimerRef).toSelf();
});
