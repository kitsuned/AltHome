import { useCallback, useMemo, useRef } from 'react';
import type { CSSProperties } from 'react';

import { computed } from 'mobx';
import { observer } from 'mobx-react-lite';

import { AnimatePresence, motion } from 'framer-motion';
import type { MotionProps } from 'framer-motion';

import { Portal } from '@reach/portal';

import { useContainer } from '@di';

import { LauncherService } from 'shared/services/launcher';

import { MenuAction, useLrudService, useRibbonService, useScrollService } from '../../services';
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

export const RibbonCard = observer<RibbonCardProps>(({ launchPoint }) => {
	const lrudService = useLrudService();
	const ribbonService = useRibbonService();
	const scrollService = useScrollService();

	const launcherService = useContainer().get(LauncherService);

	const cardRef = useRef<HTMLButtonElement>(null);

	const isSelected = computed(() => lrudService.isSelected(launchPoint)).get();
	const index = computed(() => lrudService.getIndexByLaunchPoint(launchPoint)).get();

	const showContextMenu = isSelected && lrudService.showContextMenu;

	const style = useMemo<CSSProperties>(
		() => ({
			zIndex: isSelected ? 1000 : index + 5,
			'--card-color': launchPoint.iconColor,
		}),
		[index, isSelected, launchPoint.iconColor],
	);

	const handleMouseOver = useCallback(() => {
		if (!scrollService.isAnimating) {
			lrudService.focusToNode(launchPoint.id);
		}
	}, [launchPoint]);

	const handleClick = useCallback(() => {
		void ribbonService.launch(launchPoint);
	}, [launchPoint]);

	const handleAction = useCallback(
		(action: MenuAction) => {
			lrudService.closeMenu();

			if (action === MenuAction.Move) {
				lrudService.enableMoveMode();
			}

			if (action === MenuAction.Hide) {
				launcherService.hide(launchPoint);
			}

			if (action === MenuAction.Uninstall) {
				void launcherService.uninstall(launchPoint);
			}
		},
		[launchPoint],
	);

	return (
		<>
			<motion.button
				layout='position'
				ref={cardRef}
				className={s.card}
				onClick={handleClick}
				onMouseOver={handleMouseOver}
				animate={isSelected ? (lrudService.moving ? 'moving' : 'selected') : undefined}
				style={style}
				{...motionProps}
			>
				<img src={launchPoint.icon} className={s.icon} />
			</motion.button>

			<AnimatePresence>
				{showContextMenu && (
					<Portal type='context-menu'>
						<RibbonContextMenu
							cardRef={cardRef}
							onSelect={handleAction}
							removable={launchPoint.removable}
						/>
					</Portal>
				)}
			</AnimatePresence>
		</>
	);
});
