import {AnimatePresence, motion} from 'motion/react';
import {Button, Field, Input, Label} from '@headlessui/react';
import {MouseEvent, useCallback, useRef, useState} from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import {useTranslations} from 'next-intl';

type Props = {
	loading: 'custom' | boolean
	onClick: (amount: 'custom') => void
}

export default function CustomInput({loading, onClick}: Props) {
	const t = useTranslations('form.customAmount');
	const customAmountRef = useRef<HTMLInputElement>(null);
	const [error, setError] = useState<string | undefined>();

	const handleClick = useCallback((event: MouseEvent) => {
		if (!customAmountRef.current) {
			return;
		}

		const amount = parseInt(customAmountRef.current.value, 10);

		if (isNaN(amount) || amount <= 0) {
			event.preventDefault();
			setError(t('error'));
			return;
		}

		onClick('custom');
	}, [onClick, t]);

	const handleChange = () => {
		setError(undefined);
	};

	return (
		<Field>
			<Label>
				{t('label')}
			</Label>
			<div className="grid grid-cols-6 gap-x-3">
				<div className="col-span-4">
					<div className={`input-container ${error ? 'error' : ''}`}>
						<Input
							id="customAmount"
							min={1}
							name="customAmount"
							onChange={handleChange}
							readOnly={loading !== false}
							ref={customAmountRef}
							type="number"
						/>
					</div>
				</div>
				<div className="col-span-2">
					<Button className="transition-all" disabled={loading !== false} onClick={handleClick}>
						{
							loading === 'custom'
								? <LoadingSpinner/>
								: t('button')
						}
					</Button>
				</div>
			</div>
			<AnimatePresence>
				{
					error && (
						<motion.div
							animate={{height: 'auto'}}
							className="error helper-text overflow-hidden"
							exit={{height: 0}}
							initial={{height: 0}}
						>
							{error}
						</motion.div>
					)
				}
			</AnimatePresence>
		</Field>
	);
}
