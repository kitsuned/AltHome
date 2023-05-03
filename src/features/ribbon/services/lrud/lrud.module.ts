import { ContainerModule } from 'inversify';

import { RibbonSymbols, useContainer } from '@di';

import { LrudService } from './lrud.service';

export const lrudModule = new ContainerModule(bind => {
	bind(RibbonSymbols.LrudService).to(LrudService);
});

export const useLrudService = () => useContainer().get<LrudService>(RibbonSymbols.LrudService);
