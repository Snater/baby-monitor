import {PropsWithChildren} from 'react';

type Props = PropsWithChildren<{
	icon: string
}>

export default function SecondaryHeader({children, icon}: Props) {
	return (
		<div className="bg-linear-to-r from-stone-200 to-stone-50 py-2 w-full">
			<div className="flex gap-3 items-center max-w-lg mx-auto px-3">
				<div className="text-2xl">{icon}</div>
				<h2>{children}</h2>
			</div>
		</div>
	);
}
