import { Service } from './bus';

const service = new Service();

service.register<{ crash: boolean }>('/hello', async function* (message) {
	yield { greetings: 'Hello!' };
	yield { message: 'Let me waste your time, hold on...' };

	await new Promise(resolve => setTimeout(resolve, 1000));

	yield { message: 'Are you still here?' };

	await new Promise(resolve => setTimeout(resolve, 1000));

	if (message.crash) {
		throw new Error('Terrible error... Boo!');
	}

	return { message: 'My Final Message. Goodbye' };
});
