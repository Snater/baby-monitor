export type Event = {
	id: number
	amount: number
	time: number
}

export type FormState = {
	message: string
	events?: Event[]
}
