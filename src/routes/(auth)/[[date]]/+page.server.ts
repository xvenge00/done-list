import { type Actions, error, redirect, fail } from '@sveltejs/kit';
import { deleteItemRequest, newDoneItemRequest } from '../api/done/api';
import * as logger from '$lib/logger';
import { toISOString } from '$lib/date';
import { date } from 'yup';
import type { PageServerLoad } from './$types';
import { createPostAt, deletePost, getDoneItemsForDate } from '$lib/server/db';
import { emailFromSession } from '$lib/server/auth';

function getDateFromParam(dateParam: string | undefined): string {
	let date = dateParam;
	if (date === undefined) {
		date = toISOString(new Date());
	}

	return date;
}

async function validateParam(dateParam: string) {
	try {
		await date().required().validate(dateParam);
	} catch (e: any) {
		throw error(404, 'invalid date');
	}
}

export const load: PageServerLoad = async ({ params, locals }) => {
	let session = await locals.getSession();
	if (!session || !session.user || !session.user.email) {
		// throw error(401, {message: "Unauthorized"});
		throw redirect(302, '/welcome');
	}

	// logger.info("params.date", params.date);
	let date = getDateFromParam(params.date);
	await validateParam(date);

	logger.info('date', date);

	let email = emailFromSession(await locals.getSession());
	if (!email) {
		throw error(500, { message: 'Email not present' });
	}

	let done_items = await getDoneItemsForDate(email, date);

	return {
		done_items: done_items,
		date: date
	};
};

export const actions: Actions = {
	create: async ({ request, params, locals }) => {
		let session = await locals.getSession();
		if (!session || !session.user || !session.user.email) {
			throw fail(401, { user: 'Unauthorized' });
		}

		let date = getDateFromParam(params.date);
		logger.info('date', date);
		await validateParam(date);

		const data = Object.fromEntries(await request.formData());
		logger.info('creating done item: ', JSON.stringify(data));
		let new_done_item = await newDoneItemRequest.validate(data);

		let email = emailFromSession(await locals.getSession());
		if (!email) {
			throw error(500, { message: 'Email not present' });
		}
		await createPostAt(email, new_done_item.text, date);
		logger.info('created new item');
	},
	delete: async ({ request, locals }) => {
		let session = await locals.getSession();
		if (!session || !session.user || !session.user.email) {
			throw fail(401, { user: 'Unauthorized' });
		}

		const data = Object.fromEntries(await request.formData());
		logger.info('deleting done item: ', JSON.stringify(data));
		let itemToDelete = await deleteItemRequest.validate(data);

		let email = emailFromSession(await locals.getSession());
		if (!email) {
			throw error(500, { message: 'Email not present' });
		}

		await deletePost(email, itemToDelete.uid);
	}
};
