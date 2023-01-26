import { useEffect } from 'react';

import { animate } from 'framer-motion';

type UseKeepElementInViewHookProps = {
	target?: HTMLElement | null;
	container?: HTMLElement | null;
};

export const useKeepElementInView = ({ target, container }: UseKeepElementInViewHookProps) => {
	useEffect(() => {
		if (!target) {
			return;
		}

		const { left, right } = target.getBoundingClientRect();
		const outOfBounds = left < 0 || right > window.innerWidth;

		const shift = Math.min(left, 0, 3);

		// TODO: unfinished animation stuff xd
	}, [target, container]);
};
