import { useCallback, useMemo, useRef } from 'react';
import type { CSSProperties } from 'react';

import { computed } from 'mobx';
import { observer } from 'mobx-react-lite';

import { AnimatePresence, motion } from 'framer-motion';
import type { MotionProps } from 'framer-motion';

import { Portal } from '@reach/portal';

import { MenuAction, useRibbonService } from '../../services';
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

	const style = useMemo<CSSProperties>(
		() => ({
			zIndex: isSelected ? 1000 : position + 5,
			'--card-color': launchPoint.iconColor,
		}),
		[position, isSelected, launchPoint.iconColor],
	);

	const handleMouseOver = useCallback(() => {
		if (!svc.scrollService.isAnimating) {
			// TODO focusToNode(launchPoint.id)
		}
	}, [svc.scrollService.isAnimating]);

	const handleClick = useCallback(() => launchPoint.launch(), [launchPoint]);

	// const handleAction = useCallback(
	// 	(action: MenuAction) => {
	// 		lrudService.closeMenu();
	//
	// 		if (action === MenuAction.Move) {
	// 			lrudService.enableMoveMode();
	// 		}
	//
	// 		if (action === MenuAction.Hide) {
	// 			launchPoint.hide();
	// 		}
	//
	// 		if (action === MenuAction.Uninstall) {
	// 			void launchPoint.uninstall();
	// 		}
	// 	},
	// 	[launchPoint],
	// );

	return (
		<>
			<motion.button
				layout='position'
				ref={cardRef}
				className={s.card}
				onClick={handleClick}
				onMouseOver={handleMouseOver}
				animate={isSelected ? 'selected' : undefined}
				// animate={isSelected ? (lrudService.moving ? 'moving' : 'selected') : undefined}
				style={style}
				{...motionProps}
			>
				<img src={launchPoint.icon} className={s.icon} />
			</motion.button>

			<AnimatePresence>
				{svc.contextMenuService.visible && (
					<Portal type='context-menu'>
						<RibbonContextMenu
							ref={svc.contextMenuService.containerRef}
							cardRef={cardRef}
							onSelect={x => {
								console.log('sel menu act', x);
							}}
							removable={launchPoint.removable}
						/>
					</Portal>
				)}
			</AnimatePresence>
		</>
	);
});
