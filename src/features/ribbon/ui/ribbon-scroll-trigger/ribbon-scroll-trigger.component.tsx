import { memo } from 'react';

import type { RibbonScrollTriggerProps } from './ribbon-scroll-trigger.interface';

import s from './ribbon-scroll-trigger.module.scss';

export const RibbonScrollTrigger = memo(({ onTrigger }: RibbonScrollTriggerProps): JSX.Element => (
	<>
		<div
			className={s.left}
			onMouseOver={() => onTrigger('left')}
			onMouseOut={() => onTrigger(null)}
		/>

		<div
			className={s.right}
			onMouseOver={() => onTrigger('right')}
			onMouseOut={() => onTrigger(null)}
		/>
	</>
));
