export const pick = <T extends object, U extends keyof T, R = Pick<T, U>>(
	object: T,
	...props: U[]
) =>
	props.reduce(
		(accumulator, key) => Object.assign(accumulator, { [key]: object[key as U] }),
		{},
	) as R;
