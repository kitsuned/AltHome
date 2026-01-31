import { ContainerProvider, container } from 'shared/core/di';

import { Ribbon } from '../features/ribbon';

export const App = (): JSX.Element => (
	<ContainerProvider container={container}>
		<Ribbon />
	</ContainerProvider>
);
