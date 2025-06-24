import {z} from 'zod/v4';

const eventBaseSchema = z.object({
	time: z.iso.datetime(),
});

const milkEventSchema = eventBaseSchema.extend({
	amount: z.coerce.number(),
});

export const addSchema = milkEventSchema;

export const syncSchema = z.object({
	id: z.string(),
	delete: z.array(z.number()),
	events: z.array(milkEventSchema),
});

export const deleteSchema = z.object({
	id: z.coerce.number(),
});

export const getSchema = z.object({
	date: z.iso.datetime(),
	readableId: z.string(),
});
