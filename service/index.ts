import { Service } from './bus';
import { routines } from './routines';

const service = new Service();

service.register('/hello', async function* (message) {
	for (const ctor of routines) {
		const routine = new ctor();

		yield { done: false, status: `apply ${routine.id}` };

		await routine.apply();
	}

	return { done: true, message: 'My Final Message. Goodbye' };
});
