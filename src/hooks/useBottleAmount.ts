'use client'

import {createLocalStorageStore} from '@/lib/localStorageStore';

const {use, set} = createLocalStorageStore<number>(
	'bottleAmount',
	0,
	raw => {const n = parseInt(raw, 10); return isNaN(n) ? undefined : n;},
);

export const setBottleAmount = set;

export function useBottleAmount(): {amount: number; setBottleAmount: (amount: number) => void} {
	const {value, set: setAmount} = use();
	return {amount: value, setBottleAmount: setAmount};
}