'use client'

import {Cog8ToothIcon} from '@heroicons/react/16/solid';
import {Popover, PopoverButton, PopoverPanel} from '@headlessui/react';
import BottleSliderSwitcher from './BottleSliderSwitcher';
import LanguageSwitcher from './LanguageSwitcher';
import SessionIdSwitcher from './SessionIdSwitcher';
import {useTranslations} from 'next-intl';

export default function Settings() {
	const t = useTranslations('settings');

	return (
		<Popover>
			<PopoverButton
				aria-label={t('open')}
				className="bg-transparent border-1 border-title-border/30 h-10 p-2 w-10 hover:bg-title-border/20 active:bg-title-border/50 data-[open]:bg-title-border/80"
			>
				<Cog8ToothIcon aria-hidden="true" className="h-full w-full"/>
			</PopoverButton>
			<PopoverPanel
				transition
				anchor="bottom end"
				className="bg-overlay-bg duration-200 ease-in-out p-3 rounded-lg transition [--anchor-gap:--spacing(5)] [--anchor-offset:--spacing(6)] [--anchor-padding:--spacing(2)] data-[closed]:opacity-0"
			>
				<div className="max-w-lg">
					<SessionIdSwitcher/>
					<hr className="border-title-border/20 dark:border-foreground/20 my-3"/>
					<BottleSliderSwitcher/>
					<hr className="border-title-border/20 dark:border-foreground/20 my-3"/>
					<LanguageSwitcher/>
				</div>
			</PopoverPanel>
		</Popover>
	);
}