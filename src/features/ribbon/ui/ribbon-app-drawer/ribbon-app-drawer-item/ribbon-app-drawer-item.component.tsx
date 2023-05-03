import { useEffect, useMemo, useRef } from 'react';
import type { CSSProperties } from 'react';

import { observer } from 'mobx-react-lite';

import clsx from 'clsx';
import { useFocusable } from 'react-sunbeam';

import type { RibbonAppDrawerItemProps } from './ribbon-app-drawer-item.interface';
import s from './ribbon-app-drawer-item.module.scss';

export const RibbonAppDrawerItem = observer(
	({ launchPoint, onSelect }: RibbonAppDrawerItemProps): JSX.Element => {
		const elementRef = useRef<HTMLButtonElement>(null);
		const { focused } = useFocusable({ elementRef, focusKey: launchPoint.id });

		const style = useMemo(
			() => ({ '--icon-color': launchPoint.iconColor } as CSSProperties),
			[launchPoint.iconColor],
		);

		useEffect(() => {
			if (focused) {
				onSelect(launchPoint);

				elementRef.current?.scrollIntoView({ block: 'nearest' });
			}
		}, [focused, launchPoint, onSelect]);

		return (
			<button ref={elementRef} className={clsx(s.button, focused && s.focused)} style={style}>
				<img src={launchPoint.icon} className={s.icon} />

				{launchPoint.title}
			</button>
		);
	},
);
