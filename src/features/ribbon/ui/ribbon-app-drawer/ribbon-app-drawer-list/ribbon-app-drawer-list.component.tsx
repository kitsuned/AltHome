import { useCallback, useEffect, useRef } from 'react';

import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';

import { useSunbeam } from 'react-sunbeam';

import { useContainer } from '@di';

import type { LaunchPoint } from 'shared/services/launcher';
import { SettingsService } from 'shared/services/settings';

import { RibbonService } from 'features/ribbon/services';

import { RibbonAppDrawerItem } from '../ribbon-app-drawer-item';

import s from './ribbon-app-drawer-list.module.scss';

export const RibbonAppDrawerList = observer((): JSX.Element => {
	const container = useContainer();
	const settingsService = container.get(SettingsService);
	const ribbonService = container.get(RibbonService);

	const ref = useRef<HTMLDivElement>(null);
	const selectedLpIdRef = useRef<string | null>(null);

	const { moveFocusUp, moveFocusDown } = useSunbeam();

	useEffect(() => {
		const maybeElement = ref.current;

		const handleKeyDown = (event: KeyboardEvent) => {
			event.stopPropagation();
			event.stopImmediatePropagation();
			event.preventDefault();

			if (event.key === 'ArrowUp') {
				moveFocusUp();
			}

			if (event.key === 'ArrowDown') {
				moveFocusDown();
			}

			if (event.key === 'GoBack') {
				runInAction(() => {
					ribbonService.addAppsDrawerActive = false;
				});
			}

			if (event.key === 'Enter' && selectedLpIdRef.current) {
				runInAction(() => {
					settingsService.order.push(selectedLpIdRef.current!);
					ribbonService.addAppsDrawerActive = false;
				});
			}
		};

		maybeElement?.focus();
		maybeElement?.addEventListener('keydown', handleKeyDown);

		return () => maybeElement?.removeEventListener('keydown', handleKeyDown);
	}, [moveFocusDown, moveFocusUp]);

	const handleSelected = useCallback(({ launchPointId }: LaunchPoint) => {
		selectedLpIdRef.current = launchPointId;
	}, []);

	return (
		<div ref={ref} tabIndex={0} className={s.list}>
			{ribbonService.availableLaunchPoints.map(lp => (
				<RibbonAppDrawerItem
					key={lp.launchPointId}
					launchPoint={lp}
					onSelect={handleSelected}
				/>
			))}
		</div>
	);
});
