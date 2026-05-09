'use client'

import {createLocalStorageStore} from '@/lib/localStorageStore';

export type Unit = 'ml' | 'oz';

const {use} = createLocalStorageStore<Unit>(
	'unit',
	'ml',
	raw => raw === 'oz' ? 'oz' : 'ml',
);

export function useUnit(): {unit: Unit; setUnit: (unit: Unit) => void} {
	const {value, set: setUnit} = use();
	return {unit: value, setUnit};
}