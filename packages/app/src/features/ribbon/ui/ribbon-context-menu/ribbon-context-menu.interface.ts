import type React from 'react';

export type RibbonContextMenuProps = {
	cardRef: React.MutableRefObject<HTMLElement | null>;
	removable?: boolean;
};
