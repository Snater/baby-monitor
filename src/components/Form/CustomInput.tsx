type Props = {
	onClick: (amount: 'custom') => void
}

export default function CustomInput({onClick}: Props) {
	return (
		<>
			<label htmlFor="customAmount">
				Custom Amount
			</label>
			<div className="grid grid-cols-6 gap-x-3">
				<div className="col-span-4">
					<div className="input-container">
						<input
							id="customAmount"
							min={0}
							name="customAmount"
							type="number"
						/>
					</div>
				</div>
				<div className="col-span-2">
					<button onClick={() => onClick('custom')}>
						Submit
					</button>
				</div>
			</div>
		</>
	);
}
