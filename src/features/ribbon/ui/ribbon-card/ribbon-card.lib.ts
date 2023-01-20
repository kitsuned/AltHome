import { useCallback, useMemo } from 'react';

import type { MotionProps, TargetAndTransition } from 'framer-motion';

import { LunaAPI } from 'lib/luna';

import type { RibbonCardProps } from './ribbon-card.interface';

const whileActive: TargetAndTransition = {
	x: 3.4, // magic number :D
	height: 270,
	transition: {
		// ease: 'circOut',
	},
};

export const useRibbonCard = ({ metadata, onOpen }: RibbonCardProps) => {
	const icon = `./root${metadata.mediumLargeIcon || metadata.largeIcon || metadata.icon}`;

	const handleClick = useCallback(() => {
		void LunaAPI.launch(metadata.id);

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
		handleClick,
		motionMixin,
	};
};
