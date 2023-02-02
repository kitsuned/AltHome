import { autorun, makeAutoObservable, reaction, toJS } from 'mobx';

import { omit } from 'ramda';

import { luna, LunaTopic } from 'shared/services/luna';

import type { Serializable } from 'shared/api/serializable';

type Settings = {
	reducedMotion: boolean;
	deep: {
		counter: number;
	};
};

const KEY = process.env.APP_ID as 'com.kitsuned.althome';

class SettingsStore implements Serializable<Settings>, Settings {
	public hydrated: boolean = false;
	public reducedMotion: boolean = false;
	public deep = {
		counter: 0,
	};

	private topic = new LunaTopic<{ configs: { [KEY]: Settings } }>('luna://com.webos.service.config/getConfigs', {
		configNames: [KEY],
		subscribe: true,
	});

	public constructor() {
		makeAutoObservable<SettingsStore, 'topic'>(this, { topic: false }, { autoBind: true });

		reaction(
			() => this.topic.message,
			(message, _, reaction) => {
				if (!message) {
					return;
				}

				this.hydrate(message.configs[KEY]);

				reaction.dispose();
			},
		);

		autorun(
			() => {
				if (!this.hydrated) {
					return;
				}

				void luna('luna://com.webos.service.config/setConfigs', {
					configs: {
						[KEY]: this.serialize(),
					},
				});
			},
		);
	}

	public serialize(): Settings {
		return omit(['hydrated', 'topic'], toJS(this));
	}

	public hydrate(json: Settings) {
		this.hydrated = true;

		Object.assign(this, json);
	}
}

export const settingsStore = new SettingsStore();
