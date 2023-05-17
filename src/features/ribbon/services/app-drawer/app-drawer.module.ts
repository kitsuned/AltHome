import { ContainerModule } from 'inversify';

import { AppDrawerService } from './app-drawer.service';

export const appDrawerModule = new ContainerModule(bind => {
	bind(AppDrawerService).toSelf();
});
