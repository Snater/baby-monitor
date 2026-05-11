import {mlToOz, ozToMl} from '@/lib/conversion';
import {Unit} from '@/types';

export const FALLBACK_MAX_ML = 240;

/**
 * Intervals for determining valid values per unit
 */
export enum STEP {
	ml = 10,
	oz = 0.5,
}

/**
 * Returns the maximum ml amount according to the unit.
 * (Only a ml amount is defined per environment variables, this is mapped to the closest oz step.)
 */
export function getUnitMaxMl(maxMl: number, unit: Unit) {
	if (unit === 'ml') {
		return maxMl;
	}

	const maxOz = Math.round(mlToOz(maxMl));
	return ozToMl(maxOz);
}

/**
 * Generates the valid values according to the unit.
 */
export function generateValidValues(unit: Unit, maxMl: number) {
	const ticks = [];

	if (unit === 'ml') {
		for (let ml = STEP.ml; ml <= maxMl; ml += STEP.ml) {
			ticks.push(ml);
		}
	} else {
		for (let oz = STEP.oz; oz <= mlToOz(maxMl); oz += STEP.oz) {
			ticks.push(ozToMl(oz));
		}
	}

	return ticks;
}

/**
 * Returns the closest ml valid value for (re-)snapping the amount when switching the unit.
 */
export function getClosestValidValue(ml: number, unit: Unit, maxMl: number): number {
	const ticks = generateValidValues(unit, maxMl);

	return ticks.reduce((closest, tick) => {
		const diff = Math.abs(tick - ml);
		const bestDiff = Math.abs(closest - ml);
		return diff < bestDiff ? tick : closest;
	}, 0);
}
