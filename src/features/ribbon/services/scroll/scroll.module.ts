import { ContainerModule } from 'inversify';

import { RibbonSymbols, useContainer } from '@di';

import { ScrollService } from './scroll.service';

export const scrollModule = new ContainerModule(bind => {
	bind(RibbonSymbols.ScrollService).to(ScrollService);
});

export const useScrollService = () =>
	useContainer().get<ScrollService>(RibbonSymbols.ScrollService);
