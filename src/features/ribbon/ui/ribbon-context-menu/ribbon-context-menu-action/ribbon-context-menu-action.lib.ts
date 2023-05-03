import { MenuAction } from 'features/ribbon/services';

import hide from 'assets/hide.png';
import remove from 'assets/remove.png';
import swap from 'assets/swap.png';

const map: Record<MenuAction, string> = {
	[MenuAction.Hide]: hide,
	[MenuAction.Move]: swap,
	[MenuAction.Uninstall]: remove,
};

export const mapMenuActionToIcon = (action: MenuAction): string => map[action];
