import { comparer, makeAutoObservable, reaction, toJS } from 'mobx';

import { injectable } from 'inversify';

const KEY = 'althome:settings';

type Settings = SettingsService;

@injectable()
export class SettingsService {
	public memoryQuirks: boolean = true;
	public wheelVelocityFactor: number = 1.5;
	public addNewApps: boolean = true;
	public order: string[] = [];

	public constructor() {
		this.hydrate(JSON.parse(localStorage.getItem(KEY) ?? '{}'));

		makeAutoObservable(this, {}, { autoBind: true });

		reaction(() => this.serialized, this.saveConfig, { equals: comparer.structural });
	}

	private saveConfig(serialized: Settings) {
		localStorage.setItem(KEY, JSON.stringify(serialized));
	}

	private get serialized(): Settings {
		return toJS(this);
	}

	private hydrate(json: Partial<Settings>) {
		Object.assign(this, json);
	}
}
