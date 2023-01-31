import { forwardRef, useRef } from 'react';

import { observer } from 'mobx-react-lite';

import { FocusNode } from '@please/lrud';

import { motion, Reorder } from 'framer-motion';

import { RibbonCard } from '../ribbon-card';
import { RibbonScrollTrigger } from '../ribbon-scroll-trigger';

import { useRibbon, useRibbonScroll } from './ribbon.lib';

import type { RibbonHandle, RibbonProps } from './ribbon.interface';

import s from './ribbon.module.scss';

export const Ribbon = observer(forwardRef<RibbonHandle, RibbonProps>((props, ref): JSX.Element => {
	const domRef = useRef<HTMLElement>(null);

	const { motionMixin, handleRootNodeClick, handleApplicationOpen } = useRibbon(ref, domRef, props);
	const { edge, handleTrigger } = useRibbonScroll(domRef);

	return (
		<>
			<FocusNode
				ref={domRef}
				elementType={motion.div}
				className={s.container}
				onClick={handleRootNodeClick}
				{...motionMixin}
			>
				<Reorder.Group
					as='div'
					axis='x'
					className={s.group}
					values={props.launchPoints}
					onReorder={() => {}}
				>
					{props.launchPoints.map(point => (
						<RibbonCard
							key={point.id}
							metadata={point}
							onOpen={handleApplicationOpen}
						/>
					))}
				</Reorder.Group>
			</FocusNode>

			<RibbonScrollTrigger hiddenEdge={edge} onTrigger={handleTrigger} />
		</>
	);
}));
