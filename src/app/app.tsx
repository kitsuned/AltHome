import { useCallback, useEffect, useRef } from 'react';

import { observer } from 'mobx-react-lite';

import { useBackKeyHandler } from 'shared/lib/hid';

import { LauncherStore } from 'shared/features/launcher';

import { Ribbon, RibbonHandle } from 'features/ribbon';

const launcherStore = new LauncherStore();

export const App = observer(() => {
	const ribbonRef = useRef<RibbonHandle>(null);

	const hideEventTimestamp = useRef<number>(0);

	const handleHide = useCallback(() => {
		webOSSystem.hide();
	}, []);

	useBackKeyHandler(() => {
		hideEventTimestamp.current = Date.now();

		ribbonRef.current?.hide();
	});

	useEffect(() => {
		const handler = () => {
			if (Date.now() - hideEventTimestamp.current < 200) {
				return;
			}

			ribbonRef.current?.show();
		};

		document.addEventListener('webOSRelaunch', handler);

		return () => document.removeEventListener('webOSRelaunch', handler);
	}, []);

	return launcherStore.launchPoints && (
		<Ribbon
			ref={ribbonRef}
			onHide={handleHide}
			launchPoints={launcherStore.launchPoints}
		/>
	);
});
