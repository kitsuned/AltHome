export abstract class Serializable<T> {
	abstract hydrate(json: T): void;

	abstract serialize(): T;
}
