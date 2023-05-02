import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { motion } from 'framer-motion';

import { arrow, FloatingArrow, offset, shift, useFloating } from '@floating-ui/react';
import { useSunbeam } from 'react-sunbeam';

import { useContainer } from '@di';

import { MenuAction } from 'features/ribbon';
import { LrudService } from 'features/ribbon/lib';

import { RibbonContextMenuAction } from './ribbon-context-menu-action';
import { RibbonContextMenuProps } from './ribbon-context-menu.interface';
import s from './ribbon-context-menu.module.scss';

export const RibbonContextMenu = ({
	cardRef,
	onSelect,
	removable = true,
}: RibbonContextMenuProps): JSX.Element => {
	const container = useContainer();
	const lrudService = container.get(LrudService);

	const { moveFocusUp, moveFocusDown } = useSunbeam();

	const [selectedAction, setAction] = useState<MenuAction>(MenuAction.Move);

	const keyReleasedRef = useRef<boolean>(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const arrowRef = useRef<SVGSVGElement>(null);

	const { strategy, x, y, refs, context } = useFloating({
		placement: 'top',
		middleware: [
			offset({ crossAxis: 21, mainAxis: 16 }),
			shift(),
			arrow({ element: arrowRef }),
		],
	});

	const handleKeyUp = useCallback(() => {
		keyReleasedRef.current = true;
	}, []);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			event.stopPropagation();
			event.stopImmediatePropagation();

			if (!keyReleasedRef.current) {
				return;
			}

			switch (event.key) {
				case 'ArrowRight':
				case 'ArrowLeft':
				case 'GoBack':
					lrudService.closeMenu();
					return;
				case 'ArrowUp':
					moveFocusUp();
					return;
				case 'ArrowDown':
					moveFocusDown();
					return;
				case 'Enter':
					onSelect(selectedAction);
			}
		},
		[moveFocusDown, moveFocusUp, onSelect, selectedAction],
	);

	useLayoutEffect(() => {
		menuRef.current?.focus();
		refs.setReference(cardRef.current);
	}, [cardRef, refs]);

	useEffect(() => {
		const maybeElement = menuRef.current;

		maybeElement?.addEventListener('keydown', handleKeyDown);
		maybeElement?.addEventListener('keyup', handleKeyUp);

		return () => {
			maybeElement?.removeEventListener('keydown', handleKeyDown);
			maybeElement?.removeEventListener('keyup', handleKeyUp);
		};
	}, [handleKeyDown, handleKeyUp]);

	return (
		<motion.div
			ref={refs.setFloating}
			className={s.container}
			initial={{ y: 20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			exit={{ y: -20, opacity: 0 }}
			style={{
				position: strategy,
				top: y ?? 0,
				left: x ?? 0,
			}}
		>
			<div ref={menuRef} tabIndex={0} className={s.menu}>
				<RibbonContextMenuAction action={MenuAction.Move} onSelect={setAction} />

				<RibbonContextMenuAction action={MenuAction.Hide} onSelect={setAction} />

				{removable && (
					<RibbonContextMenuAction action={MenuAction.Uninstall} onSelect={setAction} />
				)}
			</div>

			<FloatingArrow ref={arrowRef} context={context} className={s.arrow} />
		</motion.div>
	);
};
