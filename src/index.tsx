import React from 'react';
import ReactDOM from 'react-dom/client';

import { FocusRoot } from '@please/lrud';

import { App } from './app';

import './app/styles/global.scss';

ReactDOM
	.createRoot(document.getElementById('root') as HTMLElement)
	.render(
		<React.StrictMode>
			<FocusRoot pointerEvents>
				<App />
			</FocusRoot>
		</React.StrictMode>,
	);
