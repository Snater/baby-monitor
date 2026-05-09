import {mlToOz, ozToMl} from '@/lib/conversion';
import {Unit} from '@/types';
import {STEP} from '@/components/Form/BottleSlider/model';

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
 * Generates the bottle's vertical ticks according to the unit.
 */
export function generateTicks(unit: Unit, maxMl: number) {
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
 * Returns the closest tick for re-snapping the amount when switching the unit.
 */
export function getClosestTick(amount: number, unit: Unit, maxMl: number): number {
	const ticks = generateTicks(unit, maxMl);

	return ticks.reduce((closest, tick) => {
		const diff = Math.abs(tick - amount);
		const bestDiff = Math.abs(closest - amount);
		return diff < bestDiff ? tick : closest;
	}, 0);
}
