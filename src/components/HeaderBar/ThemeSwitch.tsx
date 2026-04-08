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
				className="switch group rotate-90 data-[checked]:bg-title-border/30"
			>
				<span className="switch-thumb bg-white group-data-checked:bg-blue-950 group-data-checked:border-input-outline">
					{isDark
						? <MoonIcon className="-rotate-90 size-3 text-amber-100"/>
						: <SunIcon className="-rotate-90 size-3 text-amber-500"/>
					}
				</span>
			</Switch>
		</Field>
	);
}
