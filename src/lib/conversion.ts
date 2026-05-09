import {Unit} from '@/types';

const ML_PER_OZ = 29.5735295625;

export function mlToOz(ml: number): number {
	return ml / ML_PER_OZ;
}

export function ozToMl(oz: number): number {
	return oz * ML_PER_OZ;
}

export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

export function displayAmount(amount: number, unit: Unit) {
	return unit === 'ml'
		? amount
		: Math.round(mlToOz(amount) * 2) / 2;
}
