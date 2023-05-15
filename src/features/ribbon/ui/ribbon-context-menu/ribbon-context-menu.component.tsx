import { forwardRef, useLayoutEffect, useRef, useState } from 'react';

import { observer } from 'mobx-react-lite';

import { motion } from 'framer-motion';

import { arrow, FloatingArrow, offset, shift, useFloating } from '@floating-ui/react';

import { MenuAction } from 'features/ribbon/services';

import { RibbonContextMenuAction } from './ribbon-context-menu-action';
import type { RibbonContextMenuProps } from './ribbon-context-menu.interface';
import s from './ribbon-context-menu.module.scss';

export const RibbonContextMenu = observer(
	forwardRef<HTMLDivElement, RibbonContextMenuProps>(
		({ cardRef, onSelect, removable = true }, ref): JSX.Element => {
			const menuRef = useRef<HTMLDivElement>(null);
			const arrowRef = useRef<SVGSVGElement>(null);

			const [selectedAction, setAction] = useState<MenuAction>(MenuAction.Move);

			const { strategy, x, y, refs, context } = useFloating({
				placement: 'top',
				middleware: [
					offset({ crossAxis: 21, mainAxis: 16 }),
					shift(),
					arrow({ element: arrowRef }),
				],
			});

			useLayoutEffect(() => {
				menuRef.current?.focus();
				refs.setReference(cardRef.current);
			}, [cardRef, refs]);

			const unwrapRef = (elem: HTMLDivElement | null) => {
				refs.setFloating(elem);

				if (ref) {
					if ('current' in ref) {
						ref.current = elem;
					} else {
						ref(elem);
					}
				}
			};

			return (
				<motion.div
					ref={unwrapRef}
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
							<RibbonContextMenuAction
								action={MenuAction.Uninstall}
								onSelect={setAction}
							/>
						)}
					</div>

					<FloatingArrow ref={arrowRef} context={context} className={s.arrow} />
				</motion.div>
			);
		},
	),
);
