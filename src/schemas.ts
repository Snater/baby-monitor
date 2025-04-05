import {z} from 'zod';

export const addSchema = z.object({
	amount: z.coerce.number(),
	datetime: z.coerce.number(),
});

export const eventSchema = z.object({
	amount: z.number(),
	time: z.number(),
});

export const syncSchema = z.object({
	id: z.string(),
	delete: z.array(z.number()),
	events: z.array(eventSchema),
});

export const deleteSchema = z.object({
	id: z.coerce.number(),
});

export const getSchema = z.object({
	date: z.string().date(),
	readableId: z.string(),
	timezoneOffset: z.coerce.number(),
});
