import { createContext, useContext } from 'react';

import type { Container } from 'inversify';

type ContainerContextValue = Container | null;

export const ContainerContext = createContext<ContainerContextValue>(null);

export const useContainer = () => useContext(ContainerContext)!;
