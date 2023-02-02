import { useEffect } from 'react';

import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';

import { Reorder, type MotionProps } from 'framer-motion';

import { ribbonService, scrollService } from 'features/ribbon';

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

const noop = () => {};

export const Ribbon = observer(() => {
	useEffect(() => {
		runInAction(() => {
			ribbonService.mounted = true;
		});
	}, []);

	return (
		<Reorder.Group
			ref={scrollService.scrollContainerRef}
			as='div'
			axis='x'
			className={s.group}
			values={ribbonService.launchPoints}
			animate={ribbonService.controls}
			onReorder={noop}
			{...motionProps}
		>
			{ribbonService.launchPoints.map(point => (
				<RibbonCard key={point.id} launchPoint={point} />
			))}
		</Reorder.Group>
	);
});
