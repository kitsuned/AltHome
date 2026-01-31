import { motion } from 'framer-motion';
import type { MotionProps, Variants } from 'framer-motion';

import { FloatingPortal } from '@floating-ui/react';

import { RibbonAppDrawerList } from './ribbon-app-drawer-list';
import s from './ribbon-app-drawer.module.scss';

const dialogVariants: Variants = {
	active: {
		translateX: 0,
	},
	exit: {
		translateX: 640,
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
	<FloatingPortal id='app-drawer'>
		<motion.div {...animationMixin} variants={backdropVariants} className={s.backdrop} />

		<motion.div {...animationMixin} variants={dialogVariants} className={s.drawer}>
			<h1 className={s.header}>Apps</h1>

			<RibbonAppDrawerList />
		</motion.div>
	</FloatingPortal>
);
