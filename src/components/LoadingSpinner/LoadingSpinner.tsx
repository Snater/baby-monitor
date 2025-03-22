import Image from 'next/image';
import logo from '@/assets/logo.svg';
import {useTranslations} from 'next-intl';

type Props = {
	className?: string
	size?: 'small' | 'large'
}

export default function LoadingSpinner({className, size = 'small'}: Props) {
	const t = useTranslations('loadingSpinner');

	let sizeClasses = 'h-4 inline w-4';

	if (size === 'large') {
		sizeClasses = 'h-24 w-24';
	}

	return (
		<Image
			alt={t('alt')}
			className={`animate-spin ${sizeClasses} ${className}`}
			priority
			src={logo}
		/>
	);
}
