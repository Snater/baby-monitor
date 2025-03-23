export type Event = {
	id: number
	amount: number
	time: number
}

type ErrorState = {
	message: string
	error: Error
};

export type FormState = {
	error?: ErrorState | false
}
