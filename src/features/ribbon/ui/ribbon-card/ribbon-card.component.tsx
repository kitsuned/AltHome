import { lrudService, ribbonService, scrollService } from 'features/ribbon';

import { AnimatePresence, MotionProps, Reorder } from 'framer-motion';

import { computed, runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback, useRef } from 'react';

import { launcherStore } from 'shared/services/launcher';

import { MenuAction } from '../../lib/ribbon';

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
	const cardRef = useRef<HTMLDivElement>(null);

	const icon = `./root${launchPoint.mediumLargeIcon || launchPoint.largeIcon || launchPoint.icon}`;

	const isSelected = computed(() => lrudService.isSelected(launchPoint)).get();
	const showContextMenu = isSelected && lrudService.showContextMenu;

	const handleMouseOver = useCallback(() => {
		if (!scrollService.isAnimating) {
			lrudService.focusToNode(launchPoint.launchPointId);
		}
	}, [scrollService, launchPoint]);

	const handleClick = useCallback(() => {
		runInAction(() => {
			ribbonService.visible = false;
		});

		void launcherStore.launch(launchPoint);
	}, [launchPoint]);

	const handleAction = useCallback((action: MenuAction) => {
		lrudService.closeMenu();

		if (action === MenuAction.Move) {
			lrudService.enableMoveMode();
		}

		if (action === MenuAction.Hide) {
			launcherStore.hide(launchPoint);
		}

		if (action === MenuAction.Uninstall) {
			void launcherStore.uninstall(launchPoint);
		}
	}, [launchPoint]);

	return (
		<>
			<Reorder.Item
				ref={cardRef}
				as='button'
				value={launchPoint}
				className={s.card}
				onClick={handleClick}
				onMouseOver={handleMouseOver}
				dragListener={false}
				animate={isSelected ? lrudService.moving ? 'moving' : 'selected' : undefined}
				style={{
					// @ts-ignore
					'--card-color': launchPoint.iconColor,
				}}
				{...motionProps}
			>
				<img src={icon} className={s.icon} />
			</Reorder.Item>

			<AnimatePresence>
				{showContextMenu && <RibbonContextMenu cardRef={cardRef} onSelect={handleAction} />}
			</AnimatePresence>
		</>
	);
});
