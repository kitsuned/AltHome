import { ContainerModule } from 'inversify';

import { KeyboardService } from './keyboard.service';

export const keyboardModule = new ContainerModule(bind => {
	bind(KeyboardService).toSelf().inTransientScope();
});
