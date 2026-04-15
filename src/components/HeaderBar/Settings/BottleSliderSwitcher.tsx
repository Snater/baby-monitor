'use client'

import {Field, Label, Switch} from '@headlessui/react';
import {useFormLayout} from '@/hooks/useFormLayout';
import {useTranslations} from 'next-intl';

export default function BottleSliderSwitcher() {
	const t = useTranslations('settings');
	const {layout, setFormLayout} = useFormLayout();

	return (
		<Field className="flex gap-3 items-center justify-between">
			<Label>{t('formLayout')}</Label>
			<Switch
				className="switch group"
				checked={layout === 'bottle'}
				onChange={(checked) => setFormLayout(checked ? 'bottle' : 'buttons')}
			>
				<span className="switch-thumb"/>
			</Switch>
		</Field>
	);
}
