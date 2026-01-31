import { ContainerModule } from 'inversify';

import { LifecycleManagerService } from './service/lifecycle-manager.service';

export const lifecycleManagerModule = new ContainerModule(options => {
	options.bind(LifecycleManagerService).toSelf();
});
