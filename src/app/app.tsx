import { ContainerProvider, container } from '@di';

import { Ribbon } from 'features/ribbon';

export const App = (): JSX.Element => (
	<ContainerProvider container={container}>
		<Ribbon />
	</ContainerProvider>
);
