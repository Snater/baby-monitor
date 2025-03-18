import {useRef} from 'react';

type Props = {
	bottleSize: number
	onClick: (bottleSize: number) => void
	percentage: number
}

export function BottleButton({bottleSize, onClick, percentage}: Props) {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const backgroundStyle = `linear-gradient(90deg, var(--color-sky-600) 0%, var(--color-sky-600) ${percentage}%, var(--color-sky-500) ${percentage}%)`;

	// Using "!important" (i.e. "@apply hover:bg-none!") does not override the inline styles on mobile
	// devices. Therefore, using event listeners for both mobile and desktop.
	const removeBackground = () => {
		buttonRef.current?.style.removeProperty('background');
	};

	const restoreBackground = () => {
		if (buttonRef.current) {
			buttonRef.current.style.background = backgroundStyle;
		}
	};

	return (
		<button
			key={bottleSize}
			onClick={() => onClick(bottleSize)}
			onMouseEnter={removeBackground}
			onMouseLeave={restoreBackground}
			onTouchEnd={restoreBackground}
			onTouchStart={removeBackground}
			ref={buttonRef}
			style={{background: backgroundStyle}}
		>
			{bottleSize}&thinsp;ml
		</button>
	);
}
