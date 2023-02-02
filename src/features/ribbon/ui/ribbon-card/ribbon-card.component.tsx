import { computed } from 'mobx';
import { observer } from 'mobx-react-lite';

import { MotionProps, Reorder } from 'framer-motion';

import { lrudService } from 'features/ribbon';

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

	const isSelected = computed(() => lrudService.isSelected(launchPoint.launchPointId)).get();

	return (
		<Reorder.Item
			as='button'
			value={launchPoint}
			className={s.card}
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
