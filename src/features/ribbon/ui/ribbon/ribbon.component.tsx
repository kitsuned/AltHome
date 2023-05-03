import { useEffect } from 'react';

import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';

import { AnimatePresence, motion } from 'framer-motion';
import type { MotionProps } from 'framer-motion';

import { useRibbonService } from '../../services';
import { RibbonAppDrawer } from '../ribbon-app-drawer';
import { RibbonCard } from '../ribbon-card';

import s from './ribbon.module.scss';

const motionProps: MotionProps = {
	variants: {
		hide: {
			y: '105%',
			transition: {
				duration: 0.5,
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
	const ribbonService = useRibbonService();

	useEffect(() => {
		runInAction(() => {
			ribbonService.mounted = true;
		});
	}, [ribbonService]);

	return (
		<>
			<motion.div
				ref={ribbonService.ribbonRef}
				animate={ribbonService.controls}
				className={s.group}
				{...motionProps}
			>
				{ribbonService.visibleLaunchPoints.map(lp => (
					<RibbonCard key={lp.launchPointId} launchPoint={lp} />
				))}
			</motion.div>

			<AnimatePresence>
				{ribbonService.addAppsDrawerActive && <RibbonAppDrawer />}
			</AnimatePresence>
		</>
	);
});
