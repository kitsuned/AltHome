import { memo } from 'react';

import { FocusNode } from '@please/lrud';

import { motion } from 'framer-motion';

import s from './ribbon-edit-button.module.scss';

export const RibbonEditButton = memo((): JSX.Element => (
	<FocusNode
		elementType={motion.button}
		className={s.button}
	>

	</FocusNode>
));
