import { spawnSync } from 'child_process';
import fs from 'fs';

import { parse } from '@babel/parser';
import generate from '@babel/generator';

import { Logger } from './logger';

type Program = ReturnType<typeof parse>['program'];

const logger = new Logger('keyfilter-rewire');

const addValidatorDeclaration = (program: Program) => {
	program.body.unshift(...parse(`
		var homeAppId;
		
		function checkIsAltHomeInstalled() {
			var xhr = new XMLHttpRequest();
		
			xhr.onreadystatechange = function () {
				homeAppId = xhr.status == 200 ? 'com.kitsuned.althome' : 'com.webos.app.home';
			};
			
			xhr.open('GET', 'file:///media/developer/apps/usr/palm/applications/com.kitsuned.althome/appinfo.json');
			xhr.send();
		}
	`).program.body);

	logger.info('added validator declaration');
};

const addInitializerCall = (program: Program) => {
	const initFn = program.body.find(x => x.type === 'FunctionDeclaration' && x.id?.name === 'init');

	if (initFn?.type !== 'FunctionDeclaration') {
		throw 'never';
	}

	initFn.body.body.push(...parse('checkIsAltHomeInstalled()').program.body);

	logger.info('pushed initializer call to main fn');
};

const patchLaunchHomeAppFunction = (program: Program) => {
	const launchFn = program.body.find(x => x.type === 'FunctionDeclaration' && x.id?.name === 'launchHomeApp');

	if (launchFn?.type !== 'FunctionDeclaration') {
		throw 'never';
	}

	launchFn.body.body = parse(
		`
			if (!homeAppId) return;
		
			applicationManager.launch(homeAppId, JSON.stringify({ activateType: getActivateType(key) }));
		`,
		{
			allowReturnOutsideFunction: true,
		}).program.body;

	logger.info('replaced launchHomeApp fn body');
};

export const patchKeyfilter = (from: string, to: string) => {
	logger.info(`reading ${from}`);

	const contents = fs.readFileSync(from).toString('utf8');

	logger.info(`parsing file contents`);
	const program = parse(contents, { attachComment: false }).program;

	addValidatorDeclaration(program);
	addInitializerCall(program);
	patchLaunchHomeAppFunction(program);

	logger.info('compiling keyfilter');
	const { code } = generate(program, { compact: true });

	logger.info(`saving ${to}`);
	fs.writeFileSync(to, code);
};

export const restartInputService = () => {
	const { status } = spawnSync('systemctl', ['restart', 'lginput2.service']);

	logger.info(`restarted lginput2, status code: ${status}`);
};
