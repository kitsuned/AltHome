import { Service } from './bus';
import { SERVICE_ID } from './environment';
import { routines } from './routines';

const service = new Service();

service.register('/elevate', async function* () {
	yield { done: false, status: 'Checking root status...' };

	const { root = false } = await service.oneshot<{ root: boolean }>(
		'luna://org.webosbrew.hbchannel.service/getConfiguration',
	);

	if (!root) {
		throw new Error('Not privileged.');
	} else {
		yield { done: false, status: 'Elevating...' };

		await service.oneshot('luna://org.webosbrew.hbchannel.service/exec', {
			command: `./elevate-service ${SERVICE_ID}`,
		});
	}

	return { done: true };
});

service.register('/apply', async function* () {
	for (const ctor of routines) {
		// eslint-disable-next-line new-cap
		const routine = new ctor(service);

		yield { done: false, status: `Apply ${routine.id}` };

		await routine.apply();
	}

	return { done: true };
});

service.register('/quit', async function* () {
	yield { status: 'Bye bye!' };

	queueMicrotask(() => queueMicrotask(() => process.exit(0)));

	return {};
});
