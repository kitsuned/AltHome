import { memo } from 'react';

import { Focusable } from 'react-sunbeam';

import clsx from 'clsx';

import { MenuAction } from 'features/ribbon/lib/ribbon';

import { RibbonContextMenuActionProps } from './ribbon-context-menu-action.interface';

import { mapMenuActionToIcon } from './ribbon-context-menu-action.lib';

import s from './ribbon-context-menu-action.module.scss';

export const RibbonContextMenuAction = memo(({ action, onSelect }: RibbonContextMenuActionProps): JSX.Element => (
	<Focusable onFocus={() => onSelect(action)}>
		{({ focused }) => (
			<button className={clsx(s.button, focused && s.focused, action === MenuAction.Uninstall && s.danger)}>
				<img src={mapMenuActionToIcon(action)} />

				{action}
			</button>
		)}
	</Focusable>
));
