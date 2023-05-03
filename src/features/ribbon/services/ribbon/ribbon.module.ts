import { ContainerModule } from 'inversify';

import { RibbonSymbols, useContainer } from '@di';

import { RibbonService } from './ribbon.service';

export const ribbonModule = new ContainerModule(bind => {
	bind(RibbonSymbols.RibbonService).to(RibbonService);
});

export const useRibbonService = () =>
	useContainer().get<RibbonService>(RibbonSymbols.RibbonService);
