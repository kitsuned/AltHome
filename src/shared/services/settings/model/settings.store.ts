import { comparer, makeAutoObservable, reaction, toJS, when } from 'mobx';

import { luna, LunaTopic } from 'shared/services/luna';

type Settings = {
	memoryQuirks: boolean;
	wheelVelocityFactor: number;
};

const KEY = process.env.APP_ID as 'com.kitsuned.althome';

class SettingsStore implements Settings {
	public hydrated: boolean = false;

	public memoryQuirks: boolean = true;
	public wheelVelocityFactor: number = 1.5;

	private topic = new LunaTopic<{ configs?: { [KEY]: Settings } }>('luna://com.webos.service.config/getConfigs', {
		configNames: [KEY],
		subscribe: true,
	});

	public constructor() {
		makeAutoObservable(this, {}, { autoBind: true });

		reaction(
			() => this.topic.message?.configs?.[KEY],
			settings => this.hydrate(settings ?? {}),
		);

		when(
			() => this.hydrated,
			() =>
				reaction(
					() => this.serialized,
					serialized => luna('luna://com.webos.service.config/setConfigs', {
						configs: {
							[KEY]: serialized,
						},
					}),
					{ equals: comparer.structural },
				),
		);
	}

	public get serialized(): Settings {
		const { topic, hydrated, ...settings } = toJS(this);

		return settings;
	}

	public hydrate(json: Partial<Settings>) {
		this.hydrated = true;

		Object.assign(this, json);
	}
}

export const settingsStore = new SettingsStore();
