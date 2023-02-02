import { makeAutoObservable } from 'mobx';

import type { LunaMessage, LunaRequestParams, LunaSubscriptionStatus } from '../api/luna.api';

export class LunaTopic<T extends Record<string, any>, P extends LunaRequestParams = {}> {
	public status: LunaSubscriptionStatus = 'pending';
	public message?: LunaMessage<T>;

	private bridge!: PalmServiceBridge;

	public constructor(private readonly uri: string, readonly params?: P) {
		makeAutoObservable(this, {}, { autoBind: true });

		this.subscribe();
	}

	private subscribe() {
		this.bridge = new PalmServiceBridge();

		this.bridge.onservicecallback = this.handleCallback;

		this.bridge.call(this.uri, JSON.stringify(this.params ?? {}));
	}

	private handleCallback(serialized: string) {
		this.message = JSON.parse(serialized);

		this.status = this.message?.returnValue ? 'subscribed' : 'failed';
	}
}

class LunaOneShot<T extends Record<string, any>, P extends LunaRequestParams = {}> {
	private readonly bridge: PalmServiceBridge = new PalmServiceBridge();

	public constructor(public readonly uri: string, public readonly params?: P) {}

	public call<T extends any>() {
		return new Promise<T>((resolve, reject) => {
			this.bridge.onservicecallback = message => {
				const parsed = JSON.parse(message);

				if (parsed.errorCode || !parsed.returnValue) {
					reject(parsed);
				}

				resolve(parsed);
			};

			this.bridge.call(this.uri, JSON.stringify(this.params ?? {}));
		});
	}
}

export const luna = <T extends Record<string, any>, P extends LunaRequestParams = {}, R extends LunaMessage = LunaMessage>(uri: string, params?: P) =>
	new LunaOneShot<T, P>(uri, params).call<R>();
