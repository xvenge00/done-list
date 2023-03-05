import type { Done } from "@prisma/client";
import { prisma } from "./prisma";
import * as logger from "$lib/logger"

export async function getDoneItemsForDate(email: string, date: string): Promise<Done[]> {
    return await prisma.done.findMany({
        where: {
            date: date,
            user: {
                email: email
            }
        },
    });
}

export async function createPostAt(email: string, text: string, date: string) {
    let user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                email: email
            }
        })
    }

    await prisma.done.create({
        data: {
            created_at: new Date(),
            date: date,
            text: text,
            userId: user.id
        }
    });
}

export async function deletePost(email: string, itemUid: number) {
    logger.info("deleting done item: ", JSON.stringify(itemUid));

    // TODO make sure the post belongs to email
    await prisma.done.delete({
        where: {
            id: itemUid
        }
    });
}