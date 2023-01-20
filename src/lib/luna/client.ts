export class LunaClient {
	private readonly bridge: PalmServiceBridge;

	constructor(public readonly uri: string, public readonly params: Record<string, any> = {}) {
		this.bridge = new PalmServiceBridge();
	}

	public call<T extends any>() {
		return new Promise<T>((resolve, reject) => {
			console.time(this.uri);

			this.bridge.onservicecallback = message => {
				const parsed = JSON.parse(message);

				console.timeEnd(this.uri);

				console.log(this.uri, '-->', this.params);
				console.log(this.uri, '<--', parsed);

				if (parsed.errorCode || !parsed.returnValue) {
					reject(parsed);
				}

				resolve(parsed);
			};

			this.bridge.call(this.uri, JSON.stringify(this.params));
		});
	}
}
