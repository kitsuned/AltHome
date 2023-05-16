export type LunaErrorMessage = {
	returnValue: false;
	errorCode?: number;
	errorText?: string;
};

type DeepNever<T> = {
	[K in keyof T]: T[K] extends Record<string, any> ? DeepNever<T[K]> : never;
};

export type LunaMessage<T extends Record<string, any> = {}> =
	| (LunaErrorMessage & DeepNever<T>)
	| (T & { returnValue: true });

export type LunaRequestParams<T extends Record<string, any> = Record<string, any>> = T & {
	subscribe?: boolean;
};
