'use client'

import {Field, Label} from '@headlessui/react';
import {routing} from '@/i18n/routing';
import {useLocale, useTranslations} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';

const LOCALE_LABELS: Record<(typeof routing.locales)[number], string> = {
	en: 'English',
	de: 'Deutsch',
	da: 'Dansk',
};

export default function LanguageSwitcher() {
	const t = useTranslations('settings');
	const router = useRouter();
	const pathname = usePathname();
	const locale = useLocale();

	return (
		<Field className="flex gap-3 items-center justify-between">
			<Label>{t('language')}</Label>
			<div className="flex gap-1">
				{routing.locales.map(routingLocale => (
					<button
						key={routingLocale}
						className={`px-2 py-1 text-xs w-auto ${routingLocale !== locale ? 'bg-transparent border border-input-outline text-foreground hover:bg-title-border/20 active:bg-title-border/50' : 'cursor-default hover:bg-primary active:bg-primary'}`}
						onClick={() => router.push(pathname, {locale: routingLocale})}
						type="button"
					>
						{LOCALE_LABELS[routingLocale]}
					</button>
				))}
			</div>
		</Field>
	);
}
