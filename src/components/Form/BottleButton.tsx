import LoadingSpinner from '@/components/LoadingSpinner';
import {useRef} from 'react';

type Props = {
	bottleSize: number
	loading: number | boolean
	onClick: (bottleSize: number) => void
	percentage: number
}

export function BottleButton({bottleSize, loading, onClick, percentage}: Props) {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const backgroundStyle = loading === false
		? `linear-gradient(90deg, var(--color-sky-600) 0%, var(--color-sky-600) ${percentage}%, var(--color-sky-500) ${percentage}%)`
		: 'none';

	// Using "!important" (i.e. "@apply hover:bg-none!") does not override the inline styles on mobile
	// devices. Therefore, using event listeners for both mobile and desktop.
	const removeBackground = () => {
		if (buttonRef.current) {
			buttonRef.current.style.removeProperty('background-image');
		}
	};

	const restoreBackground = () => {
		if (buttonRef.current) {
			buttonRef.current.style.backgroundImage = backgroundStyle;
		}
	};

	return (
		<button
			className="transition-all"
			disabled={loading !== false}
			key={bottleSize}
			onClick={() => onClick(bottleSize)}
			onMouseEnter={removeBackground}
			onMouseLeave={restoreBackground}
			onTouchEnd={restoreBackground}
			onTouchStart={removeBackground}
			ref={buttonRef}
			style={{backgroundImage: backgroundStyle}}
		>
			{
				loading === bottleSize
					? <LoadingSpinner/>
					: <>{bottleSize}&thinsp;ml</>
			}
		</button>
	);
}
