// TODO
// eslint-disable-next-line max-classes-per-file
import { makeAutoObservable, reaction, toJS } from 'mobx';

import { LunaMessage, LunaRequestParams } from '../api/luna.api';
import { verifyMessageContents } from '../lib/auto-elevator.lib';

export class LunaTopic<T extends Record<string, any>, P extends LunaRequestParams = {}> {
	public message: LunaMessage<T> | null = null;

	private bridge!: PalmServiceBridge;

	public constructor(private readonly uri: string, private readonly params?: P) {
		makeAutoObservable<LunaTopic<T>, 'bridge'>(this, { bridge: false }, { autoBind: true });

		this.subscribe();

		if (__DEV__) {
			console.log('<!>', uri);

			reaction(
				() => this.message,
				message => console.log('<*-', uri, toJS(message)),
			);
		}
	}

	private subscribe() {
		this.bridge = new PalmServiceBridge();

		this.bridge.onservicecallback = this.handleCallback;

		this.bridge.call(
			this.uri,
			JSON.stringify(
				this.params ?? {
					subscribe: true,
				},
			),
		);
	}

	private handleCallback(serialized: string) {
		this.message = JSON.parse(serialized);

		if (this.message) {
			verifyMessageContents(this.message);
		}
	}
}

class LunaOneShot<T extends Record<string, any>, P extends LunaRequestParams = {}> {
	private readonly bridge: PalmServiceBridge = new PalmServiceBridge();

	public constructor(public readonly uri: string, public readonly params?: P) {}

	public call() {
		return new Promise<T>((resolve, reject) => {
			this.bridge.onservicecallback = (message: string) => {
				const parsed = JSON.parse(message);

				if (__DEV__) {
					console.log('<--', this.uri, parsed);
				}

				if (parsed.errorCode || !parsed.returnValue) {
					verifyMessageContents(parsed);

					reject(parsed);
				}

				resolve(parsed);
			};

			if (__DEV__) {
				console.log('-->', this.uri, this.params);
			}

			this.bridge.call(this.uri, JSON.stringify(this.params ?? {}));
		});
	}
}

export const luna = <T extends Record<string, any>, P extends LunaRequestParams = {}>(
	uri: string,
	params?: P,
) => new LunaOneShot<T, P>(uri, params).call();
