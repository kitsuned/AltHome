import { memo } from 'react';

import type { RibbonScrollTriggerProps } from './ribbon-scroll-trigger.interface';

import s from './ribbon-scroll-trigger.module.css';

export const RibbonScrollTrigger = memo(
	({ hiddenEdge, onTrigger }: RibbonScrollTriggerProps): JSX.Element => (
		<>
			{hiddenEdge !== 'left' && (
				<div
					className={s.left}
					onMouseOver={() => onTrigger('left')}
					onMouseOut={() => onTrigger(null)}
				/>
			)}

			{hiddenEdge !== 'right' && (
				<div
					className={s.right}
					onMouseOver={() => onTrigger('right')}
					onMouseOut={() => onTrigger(null)}
				/>
			)}
		</>
	),
);
