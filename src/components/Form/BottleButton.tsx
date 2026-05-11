import {Button} from '@headlessui/react';
import LoadingSpinner from '@/components/LoadingSpinner';
import {mlToOz} from '@/lib/conversion';
import {useRef} from 'react';
import {useTranslations} from 'next-intl';
import {useUnit} from '@/hooks/useUnit';

type Props = {
	loading: number | boolean
	ml: number
	onClick: (bottleSize: number) => void
	percentage: number
}

export function BottleButton({loading, ml, onClick, percentage}: Props) {
	const t = useTranslations('form.buttons.bottleButton');
	const {unit} = useUnit();
	const buttonRef = useRef<HTMLButtonElement>(null);
	const backgroundStyle = loading === false
		? `linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary) ${percentage}%, var(--color-primary-hover) ${percentage}%)`
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
		<Button
			key={ml}
			className="transition-all"
			disabled={loading !== false}
			onClick={() => onClick(ml)}
			onMouseEnter={removeBackground}
			onMouseLeave={restoreBackground}
			onTouchEnd={restoreBackground}
			onTouchStart={removeBackground}
			ref={buttonRef}
			style={{backgroundImage: backgroundStyle}}
		>
			{
				loading === ml
					? <LoadingSpinner/>
					: t('label', {bottleSize: unit === 'oz' ? mlToOz(ml) : ml, unit})
			}
		</Button>
	);
}
