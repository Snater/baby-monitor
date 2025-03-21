import Image from 'next/image';
import logo from '@/assets/logo.svg';

type Props = {
	className?: string
	size?: 'small' | 'large'
}

export default function LoadingSpinner({className, size = 'small'}: Props) {
	let sizeClasses = 'h-4 inline w-4';

	if (size === 'large') {
		sizeClasses = 'h-24 w-24';
	}

	return (
		<Image
			alt="loading"
			className={`animate-spin ${sizeClasses} ${className}`}
			priority
			src={logo}
		/>
	);
}
