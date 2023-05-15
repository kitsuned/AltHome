import { computed } from 'mobx';
import { observer } from 'mobx-react-lite';

import clsx from 'clsx';

import { MenuAction } from 'features/ribbon/lib';
import { useRibbonService } from 'features/ribbon/services';

import type { RibbonContextMenuActionProps } from './ribbon-context-menu-action.interface';
import { mapMenuActionToIcon } from './ribbon-context-menu-action.lib';
import s from './ribbon-context-menu-action.module.scss';

export const RibbonContextMenuAction = observer(
	({ action }: RibbonContextMenuActionProps): JSX.Element => {
		const svc = useRibbonService();

		const focused = computed(() => svc.contextMenuService.isActionSelected(action)).get();

		return (
			<button
				className={clsx(
					s.button,
					focused && s.focused,
					action === MenuAction.Uninstall && s.danger,
				)}
			>
				<img src={mapMenuActionToIcon(action)} />

				{action}
			</button>
		);
	},
);
