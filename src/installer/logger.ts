import { inspect } from 'util';

export class Logger {
	private colors = ('TERM' in process.env);

	constructor(private readonly topic?: string) {}

	public info(message: any) {
		if (this.topic) {
			process.stderr.write(this.colors ? `\x1b[33m(${this.topic})\x1b[0m ` : `(${this.topic}) `);
		}

		if (typeof message !== 'string') {
			process.stderr.write(inspect(message, {
				colors: this.colors,
			}));
		} else {
			process.stderr.write(message);
		}

		process.stderr.write('\n');
	}
}
