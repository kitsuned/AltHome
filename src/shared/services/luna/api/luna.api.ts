export type LunaMessage<T extends Record<string, any> = {}> = T & {
	returnValue: boolean;
};

export type LunaRequestParams<T extends Record<string, any> = Record<string, any>> = T & {
	subscribe?: boolean;
};
