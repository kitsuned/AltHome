import { useCallback } from 'react';

import { computed, runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';

import { MotionProps, Reorder } from 'framer-motion';

import { launcherStore } from 'shared/services/launcher';

import { lrudService, ribbonService } from 'features/ribbon';

import type { RibbonCardProps } from './ribbon-card.interface';

import s from './ribbon-card.module.scss';

const motionProps: MotionProps = {
	variants: {
		selected: {
			x: 3.4,
			height: 270,
		},
	},
};

export const RibbonCard = observer<RibbonCardProps>(({ launchPoint }) => {
	const icon = `./root${launchPoint.mediumLargeIcon || launchPoint.largeIcon || launchPoint.icon}`;

	const isSelected = computed(() => lrudService.isSelected(launchPoint)).get();

	const handleMouseOver = useCallback(() => lrudService.focusToNode(launchPoint.launchPointId), [launchPoint]);

	const handleClick = useCallback(() => {
		runInAction(() => {
			ribbonService.visible = false;
		});

		void launcherStore.launch(launchPoint);
	}, [launchPoint]);

	return (
		<Reorder.Item
			as='button'
			value={launchPoint}
			className={s.card}
			onClick={handleClick}
			onMouseOver={handleMouseOver}
			dragListener={false}
			animate={isSelected ? 'selected' : undefined}
			style={{
				// @ts-ignore
				'--card-color': launchPoint.iconColor,
			}}
			{...motionProps}
		>
			<img src={icon} className={s.icon} />
		</Reorder.Item>
	);
});
