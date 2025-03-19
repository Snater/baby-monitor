import Image from 'next/image';
import {type PropsWithChildren} from 'react';
import bottle from '@/assets/bottle-white.svg';

type Props = PropsWithChildren

export default function SecondaryHeader({children}: Props) {
	return (
		<div className="bg-linear-to-r from-stone-200 to-stone-50 py-2 w-full">
			<div className="flex max-w-lg mx-auto px-3 relative">
				<Image alt="" className="absolute h-16 -top-5 w-16" src={bottle}/>
				<h2 className="ml-16">{children}</h2>
			</div>
		</div>
	);
}
