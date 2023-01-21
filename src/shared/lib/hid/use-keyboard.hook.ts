import { useEffect } from 'react';

export const enum WebOSKeyCodes {
	Back = 0x1cd,
	Home = 0x3f5,
	MouseActive = 0x600,
	MouseHidden = 0x601,
}

export const useBackKeyHandler = (callback: () => void) => {
	useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			if (event.keyCode === WebOSKeyCodes.Back || event.keyCode === WebOSKeyCodes.Home) {
				callback();
			}
		};

		document.addEventListener('keyup', handler);

		return () => document.removeEventListener('keyup', handler);
	}, []);
};
