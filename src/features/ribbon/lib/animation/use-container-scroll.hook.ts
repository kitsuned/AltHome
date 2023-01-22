import { useLayoutEffect, useRef, useState, type MutableRefObject } from 'react';

import type { TriggerZone } from '../zone';

const getReachedEdge = ({ scrollLeft, scrollWidth, clientWidth }: HTMLElement): TriggerZone => {
	if (scrollLeft < 1) {
		return 'left';
	}

	return scrollLeft > scrollWidth - clientWidth ? 'right' : null;
};

export const useContainerScroll = (ref: MutableRefObject<HTMLElement | null>, shift: number): TriggerZone => {
	const [edge, setEdge] = useState<TriggerZone>(null);

	const mountedRef = useRef(true);

	useLayoutEffect(() => {
		if (shift === 0) {
			return;
		}

		const handler = () => {
			ref.current?.scrollBy(shift, 0);

			setEdge(ref.current ? getReachedEdge(ref.current) : null);

			if (mountedRef.current) {
				window.requestAnimationFrame(handler);
			}
		};

		mountedRef.current = true;

		window.requestAnimationFrame(handler);

		return () => {
			mountedRef.current = false;
		};
	}, [shift]);

	return edge;
};
