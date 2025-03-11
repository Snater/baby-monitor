export type Event = {
	amount: number
	time: number
}

export type FormState = {
	message: string
	events?: Event[]
}
