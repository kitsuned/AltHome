import { useEffect, useState, type RefObject } from 'react';

type Zone = 'left' | 'right' | null;

export const useMouseZone = (ref: RefObject<HTMLElement>): Zone => {
	const [zone, setZone] = useState<Zone>(null);

	useEffect(() => {
		const handler = (event: MouseEvent) => {
			console.log(event.offsetX, event.offsetY);
		};

		ref.current?.addEventListener('mousemove', handler);

		return () => ref.current?.removeEventListener('mousemove', handler);
	}, []);

	return zone;
};
