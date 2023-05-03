import { observer } from 'mobx-react-lite';

import { AnimatePresence, motion } from 'framer-motion';
import type { MotionProps } from 'framer-motion';

import { useRibbonService } from 'features/ribbon/services';

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
	const svc = useRibbonService();

	return (
		<>
			<motion.div
				ref={svc.ribbonRef}
				animate={svc.controls}
				className={s.group}
				{...motionProps}
			>
				{svc.visibleLaunchPoints.map(lp => (
					<RibbonCard key={lp.launchPointId} launchPoint={lp} />
				))}
			</motion.div>

			<AnimatePresence>{svc.addAppsDrawerActive && <RibbonAppDrawer />}</AnimatePresence>
		</>
	);
});
