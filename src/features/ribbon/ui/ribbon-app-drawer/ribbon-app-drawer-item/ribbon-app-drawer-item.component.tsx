import { useEffect, useRef } from 'react';

import { observer } from 'mobx-react-lite';
import { useFocusable } from 'react-sunbeam';

import { RibbonAppDrawerItemProps } from './ribbon-app-drawer-item.interface';

export const RibbonAppDrawerItem = observer(({ launchPoint, onSelect }: RibbonAppDrawerItemProps): JSX.Element => {
	const elementRef = useRef<HTMLButtonElement>(null);
	const { focused } = useFocusable({ elementRef, focusKey: launchPoint.id });

	useEffect(() => {
		if (focused) {
			onSelect(launchPoint);
		}
	}, [focused]);

	return (
		<button ref={elementRef}>
			{launchPoint.title}: {focused ? 'focused' : 'no'}
		</button>
	);
});
