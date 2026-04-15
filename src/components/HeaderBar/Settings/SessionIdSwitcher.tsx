'use client'

import {AnimatePresence, motion} from 'motion/react';
import {ArrowPathIcon} from '@heroicons/react/16/solid';
import {Description, Field, Input, Label} from '@headlessui/react';
import {KeyboardEvent, useCallback, useRef} from 'react';
import IconButton from '@/components/IconButton';
import useIdContext from '@/components/IdContext';
import useIsOnlineContext from '@/components/IsOnlineContext';
import {useRouter} from '@/i18n/navigation';
import {useTranslations} from 'next-intl';

export default function SessionIdSwitcher() {
	const t = useTranslations('settings');
	const {id} = useIdContext();
	const {isOnline} = useIsOnlineContext();
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);

	const goToSessionId = useCallback(() => {
		if (!inputRef.current) {
			return;
		}

		router.push(`/${inputRef.current.value}`);
	}, [router]);

	const handleKeyDown = useCallback((event: KeyboardEvent) => {
		if (event.key === 'Enter' && isOnline) {
			goToSessionId();
		}
	}, [goToSessionId, isOnline]);

	return (
		<Field>
			<Label>{t('sessionId.label')}</Label>
			<Description className="mb-2 text-xs">
				{t('sessionId.description')}
				<AnimatePresence>
					{!isOnline && (
						<motion.span
							animate={{height: 'auto', opacity: 1}}
							className="block overflow-hidden warning"
							exit={{height: 0, opacity: 0}}
							initial={{height: 0, opacity: 0}}
						>
							{t('sessionId.offline')}
						</motion.span>
					)}
				</AnimatePresence>
			</Description>
			<div className="flex gap-3">
				<div className="grow input-container">
					<Input
						key={id}
						defaultValue={id}
						name="sessionId"
						onKeyDown={handleKeyDown}
						ref={inputRef}
						type="text"
					/>
				</div>
				<IconButton
					aria-label={t('sessionId.button')}
					className="aspect-square h-10 p-2 w-10"
					disabled={!isOnline}
					onClick={goToSessionId}
				>
					<ArrowPathIcon aria-hidden="true"/>
				</IconButton>
			</div>
		</Field>
	);
}
