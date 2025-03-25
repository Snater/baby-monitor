import Image from 'next/image';
import Settings from '@/components/Settings';
import logo from '@/assets/logo.svg';
import {useTranslations} from 'next-intl';

export default function HeaderBar() {
	const t = useTranslations();

	return (
		<div className="bg-title-bg border-b-title-border border-b-2 shadow-md dark:shadow-sm shadow-title-bg">
			<div className="mx-auto px-3 max-w-lg">
				<div className="flex h-16 items-center">
					<div className="flex sm:grid sm:grid-cols-[1fr_auto_1fr] gap-2 w-full">
						<div className="flex-none">
							<Image alt="Baby Monitor Logo" className="h-20 mt-2 w-20" priority src={logo}/>
						</div>
						<h1 className="flex grow items-center justify-center text-center text-title-text">
							{t('title')}
						</h1>
						<div className="flex items-center justify-end">
							<Settings/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
