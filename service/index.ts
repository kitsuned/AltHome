import process from 'process';

import { Service } from './bus';
import { routines } from './routines';

const service = new Service();

service.register('/elevate', async function* () {
	yield { done: false, status: 'Checking root status...' };

	const { root = false } = await service.oneshot(
		'luna://org.webosbrew.hbchannel.service/getConfiguration',
	);

	if (!root) {
		throw new Error('Not privileged.');
	}

	yield { done: false, status: 'Elevating...' };

	await service.oneshot('luna://org.webosbrew.hbchannel.service/exec', {
		command: './elevate-service com.kitsuned.althome.service',
	});

	return { done: true };
});

service.register('/apply', async function* () {
	for (const RoutineCtor of routines) {
		const routine = new RoutineCtor(service);

		yield { done: false, status: `Apply ${routine.id}` };

		await routine.apply();
	}

	return { done: true, message: 'My Final Message. Goodbye' };
});

service.register('/quit', async function* () {
	yield {};

	queueMicrotask(() => process.exit(0));
});
