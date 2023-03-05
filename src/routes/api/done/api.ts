import { array, date, number, object, string, type InferType } from 'yup';


export const newDoneItemRequest = object({
	text: string().required()
})

export const deleteItemRequest = object({
    uid: number().required()
})

export type NewDoneItemRequest = InferType<typeof newDoneItemRequest>;

// MUST be same as schema in schema.prisma
export const doneItem = object({
    uid: string().required(),
    created_at: date().required(),
    text: string().required(),
    date: date().required()
});

export const doneItems = array().of(doneItem).required();

export type DoneItems = InferType<typeof doneItems>;
