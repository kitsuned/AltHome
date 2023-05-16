import { ContainerModule } from 'inversify';

import { LifecycleManagerService } from './service/lifecycle-manager.service';

export const lifecycleManagerModule = new ContainerModule(bind => {
	bind(LifecycleManagerService).toSelf();
});
