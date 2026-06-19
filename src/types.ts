import {unitSchema} from '@/schemas';
import {z} from 'zod/v4';

export type ChartData = {
	events: Event[]
	selectedDate: string
};

type EventBase = {
	id: number
	time: string
};

export type MilkEvent = EventBase & {
	amount: number
};

export type Event = MilkEvent;

export type ErrorState = {
	message: string
	error?: Error
};

export type FormState = {
	error?: ErrorState | false
	event?: Event
};

export type Unit = z.infer<typeof unitSchema>;

export type Stats = {
	averageAmount: number
	averageInterval: number
	totalAmount: number
	totalFeedings: number
};
