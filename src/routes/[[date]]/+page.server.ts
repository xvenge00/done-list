import { type ServerLoadEvent, type Actions, error } from "@sveltejs/kit";
import { deleteItemRequest, doneItems, newDoneItemRequest, type DoneItems } from "$lib/../routes/api/done/api"
import * as logger from "$lib/logger"
import { prisma } from "$lib/prisma";
import { toISOString } from "$lib/date";
import { date } from 'yup';


function getDateFromParam(dateParam: string | undefined): string {
    let date = dateParam;
    if (date === undefined) {
        date = toISOString(new Date())
    }

    return date;
}

async function validateParam(dateParam: string) {
    try {
        await date().required().validate(dateParam);
    } catch(e: any) {
        throw error(404, "invalid date")
    }
}

export async function load({ params }: ServerLoadEvent)  {
    // logger.info("params.date", params.date);
    let date = getDateFromParam(params.date);
    await validateParam(date);
    
    logger.info("date", date);
    let done_items = await prisma.done.findMany({
        where: {
            date: date
        }
    });

    return {
        done_items: done_items,
        date: date
    }
}

export const actions: Actions = {
	create: async ({ request, params }) => {
        let date = getDateFromParam(params.date);
        logger.info("date", date);
        await validateParam(date);

		const data = Object.fromEntries(await request.formData());
        logger.info("creating done item: ", JSON.stringify(data));
        let new_done_item = await newDoneItemRequest.validate(data)
		
        await prisma.done.create({
			data: {
				created_at: new Date(),
                date: date,
				text: new_done_item.text
			}
		});
        logger.info("created new item");
	},
    delete: async ({ request }) => {
        const data = Object.fromEntries(await request.formData());
        logger.info("deleting done item: ", JSON.stringify(data));
        let itemToDelete = await deleteItemRequest.validate(data);

        await prisma.done.delete({
			where: {
                uid: itemToDelete.uid
            }
		});
    }
};

// export function match(value) {
// 	return /^[0-9a-f]{6}$/.test(value);
// }
