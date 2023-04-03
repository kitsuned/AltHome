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

		this.bridge.call(this.uri, JSON.stringify(this.params ?? {
			subscribe: true,
		}));
	}

	private handleCallback(serialized: string) {
		this.message = JSON.parse(serialized);

		this.status = this.message?.returnValue ? 'subscribed' : 'failed';
	}
}

class LunaOneShot<T extends Record<string, any>, P extends LunaRequestParams = {}> {
	private readonly bridge: PalmServiceBridge = new PalmServiceBridge();

	public constructor(public readonly uri: string, public readonly params?: P) {}

	public call() {
		return new Promise<T>((resolve, reject) => {
			this.bridge.onservicecallback = message => {
				const parsed = JSON.parse(message);

				console.log('<--', this.uri, parsed);

				if (parsed.errorCode || !parsed.returnValue) {
					if (typeof parsed?.errorText === 'string' && parsed.errorText.startsWith('Denied method call')) {
						this.requestElevation().catch();
					}

					reject(parsed);
				}

				resolve(parsed);
			};

			console.log('-->', this.uri, this.params);

			this.bridge.call(this.uri, JSON.stringify(this.params ?? {}));
		});
	}

	private async requestElevation() {
		const x = await luna<{ root: boolean; }>('luna://org.webosbrew.hbchannel.service/getConfiguration');

		if (!x.root) {
			await luna('luna://com.webos.notification/createToast', {
				message: '[AltHome] Check root status!',
			});

			return;
		}

		await luna('luna://com.webos.notification/createToast', {
			message: '[AltHome] Getting things ready…',
		});

		await luna('luna://org.webosbrew.hbchannel.service/exec', {
			command: '/media/developer/apps/usr/palm/applications/com.kitsuned.althome/service --self-elevation',
		});

		window.close();
	}
}

export const luna = <T extends Record<string, any>, P extends LunaRequestParams = {}>(uri: string, params?: P) =>
	new LunaOneShot<T, P>(uri, params).call();
