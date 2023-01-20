import { memo } from 'react';

import { FocusNode } from '@please/lrud';

import { motion } from 'framer-motion';

import { useRibbonCard } from './ribbon-card.lib';

import type { RibbonCardProps } from './ribbon-card.interface';

import s from './ribbon-card.module.scss';

export const RibbonCard = memo((props: RibbonCardProps): JSX.Element => {
	const { icon, handleClick, motionMixin } = useRibbonCard(props);

	return (
		<FocusNode
			elementType={motion.button}
			className={s.card}
			onClick={handleClick}
			onSelected={handleClick}
			{...motionMixin}
		>
			<img src={icon} className={s.icon} />
		</FocusNode>
	);
});
