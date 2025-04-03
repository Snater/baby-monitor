import {z} from 'zod';

export const addSchema = z.object({
	amount: z.coerce.number(),
	// zod is not yet able to handle datetime without seconds,
	// see https://github.com/colinhacks/zod/issues/3636
	datetime: z.preprocess(input => `${input}:00`, z.string().datetime({local: true})),
	timezoneOffset: z.coerce.number(),
});

export const eventSchema = z.object({
	amount: z.number(),
	time: z.number(),
});

export const addMultipleSchema = z.object({
	id: z.string(),
	events: z.array(eventSchema),
	timezoneOffset: z.number(),
});

export const deleteSchema = z.object({
	id: z.coerce.number(),
});

export const getSchema = z.object({
	date: z.string().date(),
	readableId: z.string(),
});
