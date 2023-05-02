import { FocusManager, SunbeamProvider } from 'react-sunbeam';

import { ContainerProvider, container } from '@di';

import { Ribbon } from 'features/ribbon';

const focusManager = new FocusManager();

export const App = (): JSX.Element => (
	<ContainerProvider container={container}>
		<SunbeamProvider focusManager={focusManager}>
			<Ribbon />
		</SunbeamProvider>
	</ContainerProvider>
);
