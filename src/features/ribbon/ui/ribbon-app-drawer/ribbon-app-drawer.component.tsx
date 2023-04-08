import { Portal } from '@reach/portal';

import { motion, MotionProps, Variants } from 'framer-motion';
import { RibbonAppDrawerList } from './ribbon-app-drawer-list';

import s from './ribbon-app-drawer.module.scss';

const dialogVariants: Variants = {
	active: {
		right: '0px',
	},
	exit: {
		right: '-640px',
	},
};

const backdropVariants: Variants = {
	active: {
		opacity: 0.6,
	},
	exit: {
		opacity: 0,
	},
};

const animationMixin: MotionProps = {
	initial: 'exit',
	animate: 'active',
	exit: 'exit',
	transition: {
		bounce: 0,
	},
};

export const RibbonAppDrawer = (): JSX.Element => (
	<Portal>
		<motion.div {...animationMixin} variants={backdropVariants} className={s.backdrop} />

		<motion.div {...animationMixin} variants={dialogVariants} className={s.drawer}>
			<h1 className={s.header}>
				Apps
			</h1>

			<RibbonAppDrawerList />
		</motion.div>
	</Portal>
);
