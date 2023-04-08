import { useEffect } from 'react';

import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';

import { AnimatePresence, motion, type MotionProps } from 'framer-motion';

import { ribbonService, scrollService } from 'features/ribbon';

import { RibbonAppDrawer } from '../ribbon-app-drawer';

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
		runInAction(() => {
			ribbonService.mounted = true;
		});
	}, []);

	return (
		<>
			<motion.div
				ref={scrollService.scrollContainerRef}
				animate={ribbonService.controls}
				className={s.group}
				{...motionProps}
			>
				{ribbonService.launchPoints.map(point => (
					<RibbonCard key={point.id} launchPoint={point} />
				))}
			</motion.div>

			<AnimatePresence>
				{ribbonService.addAppsDrawerActive && <RibbonAppDrawer />}
			</AnimatePresence>
		</>
	);
});
