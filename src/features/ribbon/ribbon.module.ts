import { ContainerModule } from 'inversify';

import { LrudService, RibbonService, ScrollService } from './model';

export const ribbonModule = new ContainerModule(bind => {
	bind(LrudService).toSelf();
	bind(RibbonService).toSelf();
	bind(ScrollService).toSelf();
});
