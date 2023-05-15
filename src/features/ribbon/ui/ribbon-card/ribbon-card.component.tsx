import { useCallback, useMemo, useRef } from 'react';
import type { CSSProperties } from 'react';

import { computed } from 'mobx';
import { observer } from 'mobx-react-lite';

import { AnimatePresence, motion } from 'framer-motion';
import type { MotionProps } from 'framer-motion';

import { Portal } from '@reach/portal';

import { useRibbonService } from '../../services';
import { RibbonContextMenu } from '../ribbon-context-menu';

import type { RibbonCardProps } from './ribbon-card.interface';
import s from './ribbon-card.module.scss';

const motionProps: MotionProps = {
	variants: {
		selected: {
			x: 3.4,
			height: 270,
		},
		moving: {
			x: 8.7,
			y: -32,
			height: 270,
		},
	},
};

export const RibbonCard = observer<RibbonCardProps>(({ position, launchPoint }) => {
	const svc = useRibbonService();

	const cardRef = useRef<HTMLButtonElement>(null);

	const isSelected = computed(() => svc.selectedLaunchPoint === launchPoint).get();

	const showContextMenu = isSelected && svc.contextMenuService.visible;

	const style = useMemo<CSSProperties>(
		() => ({
			zIndex: isSelected ? 1000 : position + 5,
			'--card-color': launchPoint.iconColor,
		}),
		[position, isSelected, launchPoint.iconColor],
	);

	const handleMouseOver = useCallback(() => {
		if (!svc.scrollService.isAnimating) {
			svc.focusToLaunchPoint(launchPoint);
		}
	}, [svc, launchPoint]);

	const handleClick = useCallback(() => launchPoint.launch(), [launchPoint]);

	return (
		<>
			<motion.button
				layout='position'
				ref={cardRef}
				className={s.card}
				onClick={handleClick}
				onMouseOver={handleMouseOver}
				animate={isSelected ? (svc.moving ? 'moving' : 'selected') : undefined}
				style={style}
				{...motionProps}
			>
				<img src={launchPoint.icon} className={s.icon} />
			</motion.button>

			<AnimatePresence>
				{showContextMenu && (
					<Portal type='context-menu'>
						<RibbonContextMenu
							ref={svc.contextMenuService.containerRef}
							cardRef={cardRef}
							removable={launchPoint.removable}
						/>
					</Portal>
				)}
			</AnimatePresence>
		</>
	);
});
