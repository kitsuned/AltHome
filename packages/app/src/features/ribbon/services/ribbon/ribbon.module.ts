import { ContainerModule } from 'inversify';

import { useContainer } from 'shared/core/di';

import { RibbonService } from './ribbon.service';

export const ribbonModule = new ContainerModule(options => {
	options.bind(RibbonService).toSelf();
});

export const useRibbonService = () => useContainer().get<RibbonService>(RibbonService);
