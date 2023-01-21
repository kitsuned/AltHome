import React, { createContext, useContext, useEffect, useState } from 'react';

import { LaunchPoint, LunaAPI } from 'shared/lib/luna';

type ConfigContext = {
	config: {
		launchPoints: LaunchPoint[];
	} | null;
};

const DEFAULT_CONTEXT_VALUE: ConfigContext = {
	config: null,
};

const useConfigQuery = () => {
	const [launchPoints, setLaunchPoints] = useState<LaunchPoint[]>([]);

	useEffect(() => {
		LunaAPI.listLaunchPoints().then(x => setLaunchPoints(x));
	}, []);

	return {
		launchPoints,
	};
};

const ConfigContext = createContext<ConfigContext>(DEFAULT_CONTEXT_VALUE);

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
	const config = useConfigQuery();

	return (
		<ConfigContext.Provider value={{ config }}>
			{children}
		</ConfigContext.Provider>
	);
};

export const useConfig = () => useContext(ConfigContext).config;
