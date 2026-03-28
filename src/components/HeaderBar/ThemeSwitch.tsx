'use client'

import {Field, Label, Switch} from "@headlessui/react";
import {MoonIcon, SunIcon} from '@heroicons/react/16/solid';
import {useTheme} from '@/hooks/useTheme';
import {useTranslations} from "next-intl";

export default function ThemeSwitch() {
	const t = useTranslations('settings');
	const {theme, setTheme} = useTheme();
	const isDark = theme === 'dark';

	return (
		<Field>
			<Label className="sr-only">{t('darkMode')}</Label>
			<Switch
				checked={isDark}
				onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
				className="bg-title-border/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary group h-6 p-0.5 rotate-90 rounded-full w-10"
			>
				<span className="bg-white border-transparent border flex items-center justify-center rounded-full shadow-sm size-5 transition-transform group-data-checked:bg-blue-950 group-data-checked:border-input-outline group-data-checked:translate-x-4">
					{isDark
						? <MoonIcon className="-rotate-90 size-3 text-amber-100"/>
						: <SunIcon className="-rotate-90 size-3 text-amber-500"/>
					}
				</span>
			</Switch>
		</Field>
	);
}
