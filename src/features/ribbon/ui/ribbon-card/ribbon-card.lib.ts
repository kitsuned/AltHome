import { useCallback, useMemo } from 'react';

import type { MotionProps, TargetAndTransition } from 'framer-motion';

import { suppressPropagation } from 'shared/lib/event';

import type { RibbonCardProps } from './ribbon-card.interface';

const whileActive: TargetAndTransition = {
	x: 3.4, // magic number :D
	height: 270,
};

export const useRibbonCard = ({ metadata, onOpen }: RibbonCardProps) => {
	const icon = `./root${metadata.mediumLargeIcon || metadata.largeIcon || metadata.icon}`;

	const handleSelection = useCallback(() => {
		onOpen(metadata.id);
	}, [metadata.id]);

	const motionMixin = useMemo(() => (<MotionProps>{
		whileFocus: whileActive,
		style: {
			'--card-color': metadata.iconColor,
		},
	}), []);

	return {
		icon,
		handleSelection,
		handleClick: suppressPropagation,
		motionMixin,
	};
};
