import { ContainerModule } from 'inversify';

import { LrudService, RibbonService, ScrollService } from './lib';

export const ribbonModule = new ContainerModule(bind => {
	bind(LrudService).toSelf();
	bind(RibbonService).toSelf();
	bind(ScrollService).toSelf();
});
