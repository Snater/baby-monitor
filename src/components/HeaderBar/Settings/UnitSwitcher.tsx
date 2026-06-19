'use client';

import {Field, Label, Switch} from '@headlessui/react';
import {getClosestValidValue, getUnitMaxMl} from '@/lib/bottleVolume';
import {MAX_ML} from '@/components/Form/BottleSlider';
import {useBottleAmount} from '@/hooks/useBottleAmount';
import {useTranslations} from 'next-intl';
import {useUnit} from '@/hooks/useUnit';

export default function UnitSwitcher() {
	const t = useTranslations('settings');
	const {unit, setUnit} = useUnit();
	const {amount, setBottleAmount} = useBottleAmount();

	return (
		<Field className="flex gap-3 items-center justify-between">
			<Label>{t('useOz')}</Label>
			<Switch
				className="switch group"
				checked={unit === 'oz'}
				onChange={checked => {
					const newUnit = checked ? 'oz' : 'ml';
					setUnit(newUnit);
					setBottleAmount(getClosestValidValue(amount, newUnit, getUnitMaxMl(MAX_ML, newUnit)));
				}}
			>
				<span className="switch-thumb"/>
			</Switch>
		</Field>
	);
}
