import Image from 'next/image';
import logo from '@/assets/logo.svg';

export default function LoadingSpinner() {
	return (
		<Image alt="loading" className="animate-spin h-24 w-24" priority src={logo}/>
	);
}
