/* eslint no-param-reassign: off */
export class JsonTransformer {
	private readonly definitions: Record<string, string>;

	public constructor(definitions: Record<string, string>) {
		this.transform = this.transform.bind(this);

		this.definitions = Object.entries(definitions).reduce(
			(accumulator, [key, value]) => ({
				...accumulator,
				[`@${key}@`]: value,
			}),
			{},
		);
	}

	public transform(buffer: Buffer): Buffer {
		const transformerScope = this;

		const transformed = JSON.parse(buffer.toString('utf8'), function reviver(...args) {
			return transformerScope.reviver.call(transformerScope, this, ...args);
		});

		return Buffer.from(JSON.stringify(transformed), 'utf8');
	}

	private reviver<T extends Record<string, any>>(objectScope: T, key: keyof T, value: any): any {
		const shouldReplaceKey = Object.keys(this.definitions).some(v =>
			(key as string).includes(v),
		);

		const newValue = typeof value === 'string' ? this.replacer(value) : value;

		if (!shouldReplaceKey) {
			return newValue;
		}

		delete objectScope[key];

		objectScope[this.replacer(key as string) as keyof T] = newValue;

		return undefined;
	}

	private replacer(value: string): string {
		for (const [template, replacement] of Object.entries(this.definitions)) {
			value = value.replaceAll(template, replacement);
		}

		return value;
	}
}
