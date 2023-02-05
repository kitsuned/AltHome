import { makeAutoObservable, reaction, toJS } from 'mobx';

import { luna, LunaTopic } from 'shared/services/luna';

import type { Serializable } from 'shared/api/serializable';

type Settings = {
	reducedMotion: boolean;
	wheelVelocityFactor: number;
};

const KEY = process.env.APP_ID as 'com.kitsuned.althome';

class SettingsStore implements Serializable<Settings>, Settings {
	public reducedMotion: boolean = false;
	public wheelVelocityFactor: number = 1.5;

	private topic = new LunaTopic<{ configs?: { [KEY]: Settings } }>('luna://com.webos.service.config/getConfigs', {
		configNames: [KEY],
		subscribe: true,
	});

	public constructor() {
		makeAutoObservable(this, {}, { autoBind: true });

		reaction(
			() => this.topic.message,
			message => this.hydrate(message?.configs?.[KEY] ?? {}),
		);

		reaction(
			() => this.serialize(),
			serialized => luna('luna://com.webos.service.config/setConfigs', {
				configs: {
					[KEY]: serialized,
				},
			}),
		);
	}

	public serialize(): Settings {
		const { topic: _, ...settings } = toJS(this);

		return settings;
	}

	public hydrate(json: Partial<Settings>) {
		Object.assign(this, json);
	}
}

export const settingsStore = new SettingsStore();
