import { useLayoutEffect, useRef, type MutableRefObject } from 'react';

export const useContainerScroll = (ref: MutableRefObject<HTMLElement | null>, shift: number) => {
	const mountedRef = useRef(true);

	useLayoutEffect(() => {
		if (shift === 0) {
			return;
		}

		const handler = () => {
			ref.current?.scrollBy(shift, 0);

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
};
