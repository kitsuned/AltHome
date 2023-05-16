import { ContainerModule } from 'inversify';

import { SystemInfoService } from './model/system-info.service';

export const systemInfoModule = new ContainerModule(bind => {
	bind(SystemInfoService).toSelf();
});
