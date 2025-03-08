import Form from 'next/form';
import addAmount from '@/app/actions/addAmount';

export default function AmountForm() {

	return (
		<Form action={addAmount}>
			<div>
				<div className="pb-4">
					<h2>🍼 Let&#39;s get some milk!</h2>

					<label htmlFor="amount" className="block text-sm/6 font-medium text-gray-900">
						Custom Amount
					</label>
					<div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
						<div className="sm:col-span-3">
							<div>
								<div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
									<input
										id="amount"
										min={0}
										name="amount"
										type="number"
										className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
									/>
								</div>
							</div>
						</div>
						<div className="sm:col-span-3">
							<button
								type="submit"
								className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								Submit
							</button>
						</div>
					</div>

				</div>
			</div>
		</Form>
	);
}
