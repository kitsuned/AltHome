import { ContainerModule } from 'inversify';

import { useContainer } from '@di';

import { ScrollService } from './scroll.service';

export const scrollModule = new ContainerModule(options => {
	options.bind(ScrollService).toSelf();
});

export const useScrollService = () => useContainer().get<ScrollService>(ScrollService);
