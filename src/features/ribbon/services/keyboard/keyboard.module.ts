import { ContainerModule } from 'inversify';

import { KeyboardService } from './keyboard.service';
import { TimerRef } from './timer-ref';

export const keyboardModule = new ContainerModule(bind => {
	bind(KeyboardService).toSelf().inTransientScope();
	bind(TimerRef).toSelf();
});
