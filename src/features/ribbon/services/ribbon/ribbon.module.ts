import { ContainerModule } from 'inversify';

import { useContainer } from '@di';

import { RibbonService } from './ribbon.service';

export const ribbonModule = new ContainerModule(bind => {
	bind(RibbonService).toSelf();
});

export const useRibbonService = () => useContainer().get<RibbonService>(RibbonService);
