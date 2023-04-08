import { memo } from 'react';
import { Focusable } from 'react-sunbeam';

import clsx from 'clsx';

import { RibbonContextMenuActionProps } from './ribbon-context-menu-action.interface';

import s from './ribbon-context-menu-action.module.scss';

export const RibbonContextMenuAction = memo(({ action, onSelect }: RibbonContextMenuActionProps): JSX.Element => (
	<Focusable onFocus={() => onSelect(action)}>
		{({ focused }) => (
			<button className={clsx(s.button, focused && s.focused)}>
				{action}
			</button>
		)}
	</Focusable>
));
