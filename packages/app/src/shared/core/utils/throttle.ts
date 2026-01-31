export const throttle = <A extends any[]>(
	fn: (...args: A) => void,
	wait: number,
): ((...args: A) => void) => {
	let timerId: ReturnType<typeof setTimeout>;
	let lastTick: number = 0;

	return (...args: A) => {
		const delta = Date.now() - lastTick;

		clearTimeout(timerId);

		if (delta > wait) {
			lastTick = Date.now();

			fn.apply(this, args);
		} else {
			timerId = setTimeout(() => fn.apply(this, args), wait);
		}
	};
};
