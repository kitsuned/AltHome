import type React from 'react';

import type { Container } from 'inversify';

import { ContainerContext } from './container.context';

type ContainerProviderProps = {
	container: Container;
	children: React.ReactNode;
};

export const ContainerProvider = ({ container, children }: ContainerProviderProps) => (
	<ContainerContext.Provider value={container}>{children}</ContainerContext.Provider>
);
