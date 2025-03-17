import {type MouseEvent} from 'react';

const DEFAULT_BOTTLE_SIZES = process.env.NEXT_PUBLIC_BOTTLE_SIZES
	? process.env.NEXT_PUBLIC_BOTTLE_SIZES
		.split(',')
		.map(bottleSize => parseInt(bottleSize, 10))
		.sort((a, b) => a - b)
	: null;

const MAX_BOTTLE_SIZE = DEFAULT_BOTTLE_SIZES
	? DEFAULT_BOTTLE_SIZES[DEFAULT_BOTTLE_SIZES.length - 1]
	: 100;

type Props = {
	onClick: (event: MouseEvent, bottleSize: number) => void
}

export function BottleButtons({onClick}: Props) {

	if (!DEFAULT_BOTTLE_SIZES) {
		return null;
	}

	return (
		<div className="grid grid-cols-3 gap-3">
			{
				DEFAULT_BOTTLE_SIZES.map(bottleSize => {
					const percentage = Math.round(bottleSize * 100 / MAX_BOTTLE_SIZE);

					return (
						<button
							className="bottle-button"
							key={bottleSize}
							onClick={event => onClick(event, bottleSize)}
							style={{
								background: `linear-gradient(90deg, var(--color-sky-600) 0%, var(--color-sky-600) ${percentage}%, var(--color-sky-500) ${percentage}%)`
							}}
						>
							{bottleSize}&thinsp;ml
						</button>
					)
				})
			}
		</div>
	);
}
