import { useRef } from 'react';

export const useSkipFrames = (frames: number, callback: () => void) => {
	const counter = useRef(frames);

	const handler = () => {
		counter.current -= 1;

		if (counter.current !== 0) {
			window.requestAnimationFrame(handler);
		} else {
			callback();
		}
	};

	window.requestAnimationFrame(handler);
};
