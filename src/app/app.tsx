import { FocusManager, SunbeamProvider } from 'react-sunbeam';

import { Ribbon } from 'features/ribbon';

const focusManager = new FocusManager();

export const App = (): JSX.Element => (
	<SunbeamProvider focusManager={focusManager}>
		<Ribbon />
	</SunbeamProvider>
);
