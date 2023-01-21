import React, { useCallback, useEffect, useImperativeHandle, useMemo } from 'react';

import { useAnimationControls, type MotionProps } from 'framer-motion';

import { useLeafFocusedNode } from '@please/lrud';

import { useSkipFrames } from '../../lib/animation';

import type { RibbonHandle, RibbonProps } from './ribbon.interface';

const motionProps: MotionProps = {
	variants: {
		hidden: {
			y: '105%',
			transition: {
				duration: .5,
			},
		},
		show: {
			y: 1,
			transition: {
				ease: 'circOut',
			},
		},
	},
	initial: 'hidden',
};

export const useRibbon = (ref: React.ForwardedRef<RibbonHandle>, { onHide }: Pick<RibbonProps, 'onHide'>) => {
	const controls = useAnimationControls();
	const focusedNode = useLeafFocusedNode();

	useImperativeHandle(ref, () => ({
		show: () => void controls.start('show'),
		hide: () => void controls.start('hidden'),
	}));

	useEffect(() => void focusedNode?.elRef.current?.focus(), [focusedNode]);

	useSkipFrames(10, () => void controls.start('show'));

	const handleRibbonHide = useCallback(() => void controls.start('hidden'), [controls]);

	const handleAnimationComplete = useCallback<NonNullable<MotionProps['onAnimationComplete']>>(definition => {
		if (definition !== 'hidden') {
			return;
		}

		onHide?.();
	}, [onHide]);

	const motionMixin = useMemo(() => (<MotionProps>{
		...motionProps,
		animate: controls,
		onAnimationComplete: handleAnimationComplete,
	}), [controls, handleAnimationComplete]);

	return {
		motionMixin,
		handleRootNodeClick: handleRibbonHide,
		handleApplicationOpen: handleRibbonHide,
	};
};
