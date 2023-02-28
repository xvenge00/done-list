import { array, date, object, string, type InferType } from 'yup';


export const newDoneItemRequest = object({
	text: string().required()
})

export type NewDoneItemRequest = InferType<typeof newDoneItemRequest>;

// MUST be same as schema in schema.prisma
export const doneItem = object({
    uid: string().required(),
    created_at: date().required(),
    text: string().required()
});

export const doneItems = array().of(doneItem);

export type DoneItems = InferType<typeof doneItems>;
