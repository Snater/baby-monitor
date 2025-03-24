export type Event = {
	id: number
	amount: number
	time: number
}

export type ErrorState = {
	message: string
	error?: Error
};

export type FormState = {
	error?: ErrorState | false
}
