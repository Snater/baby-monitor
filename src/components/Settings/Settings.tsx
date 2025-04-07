'use client'

import {AnimatePresence, motion} from 'motion/react';
import {ArrowPathIcon, InformationCircleIcon} from '@heroicons/react/16/solid';
import {
	Description,
	Field,
	Input,
	Label,
	Popover,
	PopoverButton,
	PopoverPanel,
} from '@headlessui/react';
import {KeyboardEvent, useCallback, useRef} from 'react';
import IconButton from '@/components/IconButton';
import useIsOnlineContext from '@/components/IsOnlineContext';
import {useParams} from 'next/navigation';
import {useTranslations} from 'next-intl';

export default function Settings() {
	const t = useTranslations('settings');
	const {id} = useParams();
	const {isOnline} = useIsOnlineContext();
	const inputRef = useRef<HTMLInputElement>(null);

	const goToSessionId = () => {
		if (!inputRef.current) {
			return;
		}

		location.href = `/${inputRef.current.value}`;
	}

	const handleKeyDown = useCallback((event: KeyboardEvent) => {
		if (event.key === 'Enter' && isOnline) {
			goToSessionId();
		}
	}, [isOnline]);

	return (
		<Popover>
			<PopoverButton
				className="bg-transparent border-1 border-input-outline h-10 p-2 w-10 hover:bg-title-border/20 active:bg-title-border/50 data-[open]:bg-title-border/80"
			>
				<InformationCircleIcon aria-label={t('open')} className="h-full w-full"/>
			</PopoverButton>
			<PopoverPanel
				transition
				anchor="bottom end"
				className="bg-overlay-bg duration-200 ease-in-out p-3 rounded-lg transition [--anchor-gap:--spacing(5)] [--anchor-offset:--spacing(6)] [--anchor-padding:--spacing(2)] data-[closed]:opacity-0"
			>
				<div className="max-w-lg">
					<Field>
						<Label>{t('sessionId.label')}</Label>
						<Description className="mb-2 text-xs">
							{t('sessionId.description')}
							<AnimatePresence>
								{
									!isOnline && (
										<motion.span
											animate={{height: 'auto', opacity: 1}}
											className="block overflow-hidden warning"
											exit={{height: 0, opacity: 0}}
											initial={{height: 0, opacity: 0}}
										>
												{t('sessionId.offline')}
										</motion.span>
									)
								}
							</AnimatePresence>
						</Description>
						<div className="flex gap-3">
							<div className="grow input-container">
								<Input
									defaultValue={id}
									name="sessionId"
									onKeyDown={handleKeyDown}
									ref={inputRef}
									type="text"
								/>
							</div>
							<IconButton className="aspect-square h-10 p-2 w-10" disabled={!isOnline} onClick={goToSessionId}>
								<ArrowPathIcon aria-label={t('sessionId.button')}/>
							</IconButton>
						</div>
					</Field>
				</div>
			</PopoverPanel>
		</Popover>
	);
}
