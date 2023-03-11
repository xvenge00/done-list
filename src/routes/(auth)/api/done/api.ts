import { z } from 'zod';

export const newDoneItemRequest = z.object({
	text: z
		.string({ required_error: 'text is required' })
		.min(1, { message: 'text must be at least 1 character' })
});

export const deleteItemRequest = z.object({
	uid: z.number({ required_error: 'uid is required' })
});

export type NewDoneItemRequest = z.infer<typeof newDoneItemRequest>;

// MUST be same as schema in schema.prisma
export const doneItem = z.object({
	uid: z
		.string({ required_error: 'uid is required' })
		.min(1, { message: 'uid must be at least 1 character' })
		.trim(),
	created_at: z
		.date({ required_error: 'created_at is required' })
		.min(new Date(0), { message: 'created_at must be after 1970-01-01' })
		.max(new Date(), { message: 'created_at must be before now' }),
	text: z
		.string({ required_error: 'text is required' })
		.min(1, { message: 'text must be at least 1 character' })
		.trim(),
	date: z
		.date({ required_error: 'date is required' })
		.min(new Date(0), { message: 'date must be after 1970-01-01' })
		.max(new Date(), { message: 'date must be before now' })
});

export const doneItems = z.array(doneItem);

export type DoneItems = z.infer<typeof doneItems>;
