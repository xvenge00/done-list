import type { Done } from '@prisma/client';
import { prisma } from './prisma';
import * as logger from '$lib/logger';

export async function getDoneItemsForDate(email: string, date: string): Promise<Done[]> {
	return await prisma.done.findMany({
		where: {
			date: date,
			user: {
				email: email
			}
		},
		orderBy: {
			created_at: 'desc'
		}
	});
}

export async function createPostAt(email: string, text: string, date: string) {
	await prisma.done.create({
		data: {
			created_at: new Date(),
			date: date,
			text: text,
			user: {
				connectOrCreate: {
					where: {
						email: email
					},
					create: {
						email: email
					}
				}
			}
		}
	});
}

export async function deletePost(email: string, itemUid: number) {
	logger.info('deleting done item: ', JSON.stringify(itemUid));
	await prisma.done.findFirstOrThrow({
		where: {
			id: itemUid,
			user: {
				email: email
			}
		}
	});

	await prisma.done.delete({
		where: {
			id: itemUid
		}
	});
}
