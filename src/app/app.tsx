import { useCallback, useEffect, useRef } from 'react';

import { useConfig } from 'shared/lib/config';
import { useBackKeyHandler } from 'shared/lib/hid';

import { Ribbon, RibbonHandle } from 'features/ribbon';

export const App = () => {
	const ribbonRef = useRef<RibbonHandle>(null);
	const config = useConfig();

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

	return config && (
		<Ribbon
			ref={ribbonRef}
			onHide={handleHide}
			launchPoints={config.launchPoints}
		/>
	);
};
