import Image from 'next/image';
import logo from '@/assets/logo.svg';
import {useTranslations} from 'next-intl';

export default function HeaderBar() {
	const t = useTranslations();

	return (
		<div className="bg-stone-300 border-b-stone-600 border-b-2 shadow-md shadow-stone-300">
			<div className="mx-auto px-3 max-w-lg">
				<div className="flex h-16 items-center">
					<div className="flex sm:grid sm:grid-cols-[1fr_auto_1fr] gap-2 w-full">
						<div className="flex-none">
							<Image alt="Baby Monitor Logo" className="h-20 mt-2 w-20" priority src={logo}/>
						</div>
						<h1 className="text-neutral-600 flex grow items-center justify-center text-center">
							{t('title')}
						</h1>
					</div>
				</div>
			</div>
		</div>
	);
}
