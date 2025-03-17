export default function HeaderBar() {
	return (
		<div className="bg-stone-300 border-b-stone-600 border-b-2 shadow-md shadow-stone-300">
			<div className="mx-auto px-3 max-w-lg">
				<div className="flex h-16 items-center">
					<div className="grid grid-cols-[1fr_auto_1fr] w-full">
						<div className="text-4xl">
							👶
						</div>
						<h1 className="text-neutral-600 flex grow items-center justify-center text-center">
							Baby Monitor
						</h1>
						<div className="text-4xl text-right">
							🍼
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
