import {FALLBACK_MAX_ML, getClosestValidValue, getUnitMaxMl} from '@/lib/bottleVolume';
import {BottleButton} from '@/components/Form/BottleButton';
import {useUnit} from '@/hooks/useUnit';

const DEFAULT_BOTTLE_SIZES = process.env.NEXT_PUBLIC_BOTTLE_SIZES
	? process.env.NEXT_PUBLIC_BOTTLE_SIZES
		.split(',')
		.map(bottleSize => parseInt(bottleSize, 10))
		.sort((a, b) => a - b)
	: null;

type Props = {
	/**
	 * Either a bottle size referring to the button that has triggered loading state, or a general
	 * boolean indication whether loading state has been triggered.
	 */
	loading: number | boolean
	onClick: (bottleSize: number) => void
}

export function BottleButtons({loading, onClick}: Props) {
	const {unit} = useUnit();

	if (!DEFAULT_BOTTLE_SIZES) {
		return null;
	}

	const maxBottleSize = getUnitMaxMl(
		DEFAULT_BOTTLE_SIZES
			? DEFAULT_BOTTLE_SIZES[DEFAULT_BOTTLE_SIZES.length - 1]
			: FALLBACK_MAX_ML,
		unit
	);

	return (
		<div className="grid grid-cols-3 gap-3">
			{
				DEFAULT_BOTTLE_SIZES.map(bottleSize => {
					const ml = unit === 'oz'
						? getClosestValidValue(bottleSize, 'oz', maxBottleSize)
						: bottleSize;

					const percentage = Math.round(ml * 100 / maxBottleSize);

					return (
						<BottleButton
							key={ml}
							loading={loading}
							ml={ml}
							onClick={onClick}
							percentage={percentage}
						/>
					)
				})
			}
		</div>
	);
}
