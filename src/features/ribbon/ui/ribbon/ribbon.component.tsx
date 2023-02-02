import { useEffect } from 'react';

import { observer } from 'mobx-react-lite';

import { Reorder, type MotionProps } from 'framer-motion';

import { ribbonService } from 'features/ribbon';

import { RibbonCard } from '../ribbon-card';

import s from './ribbon.module.scss';

const motionProps: MotionProps = {
	variants: {
		hide: {
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
	initial: 'hide',
};

export const Ribbon = observer(() => {
	useEffect(() => {
		ribbonService.mounted = true;
	}, []);

	return (
		<Reorder.Group
			as='div'
			axis='x'
			className={s.group}
			values={ribbonService.launchPoints}
			animate={ribbonService.controls}
			onReorder={() => {}}
			{...motionProps}
		>
			{ribbonService.launchPoints.map(point => (
				<RibbonCard key={point.id} launchPoint={point} />
			))}
		</Reorder.Group>
	);
});
