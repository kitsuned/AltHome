import type { ReactEventHandler } from 'react';

export const suppressPropagation: ReactEventHandler<HTMLElement> = (event) => {
	event.preventDefault();
	event.stopPropagation();
	event.nativeEvent?.stopImmediatePropagation();
};
