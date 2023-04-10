import { MenuAction } from 'features/ribbon/lib/ribbon';

import hide from 'assets/hide.png';
import swap from 'assets/swap.png';
import remove from 'assets/remove.png';

const map: Record<MenuAction, string> = {
	[MenuAction.Hide]: hide,
	[MenuAction.Move]: swap,
	[MenuAction.Uninstall]: remove,
};

export const mapMenuActionToIcon = (action: MenuAction): string => map[action];
