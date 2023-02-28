import * as logger from "$lib/logger";
import type { RequestEvent } from "@sveltejs/kit";
import { PrismaClient } from '@prisma/client';
import { newDoneItemRequest } from "./api"


const prisma = new PrismaClient();


const validate_post = async (request: any) => {
	return await newDoneItemRequest.validate(request)
}


export const POST = async (event: RequestEvent) => {
	try {
		let validated_request = await validate_post(await event.request.json());

		await prisma.done.create({
			data: {
				created_at: new Date(),
				text: validated_request.text
			}
		});

		logger.info("created new item");

		return new Response(JSON.stringify({}), { status: 200 });
	} catch (e: any) {
		logger.error(e);
		return new Response("{}", { status: 500 });
	}
};


export const GET = async (event: RequestEvent) => {
	try {
		logger.info("getting");

		let res = await prisma.done.findMany();

		return new Response(JSON.stringify(res),
			{
				status: 200,
				headers: {
					"Content-type": "application/json"
				}
			});
	} catch (e: any) {
		logger.error(e);
		return new Response("{}", { status: 500 });
	}
};
