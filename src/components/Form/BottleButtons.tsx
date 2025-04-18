import {BottleButton} from '@/components/Form/BottleButton';

const DEFAULT_BOTTLE_SIZES = process.env.NEXT_PUBLIC_BOTTLE_SIZES
	? process.env.NEXT_PUBLIC_BOTTLE_SIZES
		.split(',')
		.map(bottleSize => parseInt(bottleSize, 10))
		.sort((a, b) => a - b)
	: null;

const MAX_BOTTLE_SIZE = DEFAULT_BOTTLE_SIZES
	? DEFAULT_BOTTLE_SIZES[DEFAULT_BOTTLE_SIZES.length - 1]
	: 1;

type Props = {
	/**
	 * Either a bottle size referring to the button that has triggered loading state, or a general
	 * boolean indication whether loading state has been triggered.
	 */
	loading: number | boolean
	onClick: (bottleSize: number) => void
}

export function BottleButtons({loading, onClick}: Props) {

	if (!DEFAULT_BOTTLE_SIZES) {
		return null;
	}

	return (
		<div className="grid grid-cols-3 gap-3">
			{
				DEFAULT_BOTTLE_SIZES.map(bottleSize => {
					const percentage = Math.round(bottleSize * 100 / MAX_BOTTLE_SIZE);

					return (
						<BottleButton
							bottleSize={bottleSize}
							loading={loading}
							onClick={onClick}
							percentage={percentage}
							key={bottleSize}
						/>
					)
				})
			}
		</div>
	);
}
