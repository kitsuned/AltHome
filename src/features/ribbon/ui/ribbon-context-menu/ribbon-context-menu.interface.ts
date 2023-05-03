import type React from 'react';

import type { MenuAction } from 'features/ribbon';

export type RibbonContextMenuProps = {
	cardRef: React.MutableRefObject<HTMLElement | null>;
	removable?: boolean;

	onSelect(action: MenuAction): void;
};
