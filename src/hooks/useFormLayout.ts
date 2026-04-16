'use client'

import {createLocalStorageStore} from '@/lib/localStorageStore';

export type FormLayout = 'bottle' | 'buttons';

const {use, set} = createLocalStorageStore<FormLayout>(
	'formLayout',
	'bottle',
	raw => raw === 'buttons' ? 'buttons' : undefined,
);

export const setFormLayout = set;

export function useFormLayout(): {layout: FormLayout; setFormLayout: (layout: FormLayout) => void} {
	const {value, set: setLayout} = use();
	return {layout: value, setFormLayout: setLayout};
}