import type { Configuration as WebpackConfiguration } from 'webpack';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';

type Configuration = WebpackConfiguration & DevServerConfiguration;

export type WebpackEnvironment<T extends Record<string, any>> = T;

export type WebpackArgv<T extends Record<string, any>> = Partial<Pick<Configuration, 'mode'>> & {
	env: WebpackEnvironment<T>;
};

export type WebpackConfigFunction<T extends Record<string, any> = {}> = (
	env: WebpackEnvironment<T>,
	argv: WebpackArgv<T>,
) => Configuration;

export type WebpackMultipleConfigurations<T extends Record<string, any>> = Array<
	Configuration | WebpackConfigFunction<T>
>;
