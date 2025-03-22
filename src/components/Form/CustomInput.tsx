import LoadingSpinner from '@/components/LoadingSpinner';
import {useTranslations} from 'next-intl';

type Props = {
	loading: 'custom' | boolean
	onClick: (amount: 'custom') => void
}

export default function CustomInput({loading, onClick}: Props) {
	const t = useTranslations('form.customAmount');

	return (
		<>
			<label htmlFor="customAmount">
				{t('label')}
			</label>
			<div className="grid grid-cols-6 gap-x-3">
				<div className="col-span-4">
					<div className="input-container">
						<input
							id="customAmount"
							min={0}
							name="customAmount"
							readOnly={loading !== false}
							type="number"
						/>
					</div>
				</div>
				<div className="col-span-2">
					<button
						className="transition-all"
						disabled={loading !== false}
						onClick={() => onClick('custom')}
					>
						{
							loading === 'custom'
								? <LoadingSpinner/>
								: t('button')
						}
					</button>
				</div>
			</div>
		</>
	);
}
