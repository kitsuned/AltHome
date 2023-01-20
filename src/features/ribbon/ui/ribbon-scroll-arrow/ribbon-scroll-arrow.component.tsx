import React from 'react';

import type { RibbonScrollArrowProps } from './ribbon-scroll-arrow.interface';

import s from './ribbon-scroll-arrow.module.scss';

export const RibbonScrollArrow = React.memo((props: RibbonScrollArrowProps): JSX.Element => (
	<div className={s.arrow} {...props} />
));
