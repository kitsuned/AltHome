export class Deferred<T> {
	public promise: Promise<T>;
	public resolved: boolean = false;

	private resolver!: (value: T | PromiseLike<T>) => void;

	public constructor() {
		this.promise = new Promise(resolve => {
			this.resolver = resolve;
		});
	}

	public resolve(value: T | PromiseLike<T>) {
		this.resolved = true;
		this.resolver(value);
	}
}
