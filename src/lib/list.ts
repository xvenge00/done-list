import { type NewDoneItemRequest, doneItems, type DoneItems } from "$lib/../routes/api/done/api"
import * as logger from "$lib/logger"

export const add_item_today = async (text: string) => {
    let body: NewDoneItemRequest = {
        text: text
    }

    let resp = await fetch("/api/done", {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'content-type': 'application/json'
        }
    });

    if (!resp.ok) {
        throw Error(`Could not add item: (${resp.status}) (${await resp.json()})`)
    }

    logger.info("Added item")
}

export const get_list = async() => {
    let resp = await fetch("api/done", {
        method: "GET",
    });

    if (!resp.ok) {
        throw Error(`Could not list items: (${resp.status}) (${await resp.json()})`)
    }
    logger.info("Listed items")

    let validated_list: DoneItems = await doneItems.validate(await resp.json());
    logger.info("items:", validated_list);

    return validated_list;
}
