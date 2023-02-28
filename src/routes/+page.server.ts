import type { ServerLoadEvent, Actions } from "@sveltejs/kit";
import { deleteItemRequest, doneItems, newDoneItemRequest, type DoneItems } from "$lib/../routes/api/done/api"
import * as logger from "$lib/logger"
import { prisma } from "$lib/prisma";




export async function load({  }: ServerLoadEvent)  {
    let done_items = await prisma.done.findMany();

    return {
        done_items: done_items
    }
}

export const actions: Actions = {
	create: async ({ request }) => {
		const data = Object.fromEntries(await request.formData());
        logger.info("creating done item: ", JSON.stringify(data));
        let new_done_item = await newDoneItemRequest.validate(data)
		
        await prisma.done.create({
			data: {
				created_at: new Date(),
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