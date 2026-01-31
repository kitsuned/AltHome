import { ContainerModule } from 'inversify';

import { AppDrawerService } from './app-drawer.service';

export const appDrawerModule = new ContainerModule(options => {
	options.bind(AppDrawerService).toSelf();
});
