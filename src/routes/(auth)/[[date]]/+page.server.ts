import { type Actions, error, redirect, fail } from '@sveltejs/kit';
import { deleteItemRequest, newDoneItemRequest } from '$lib/db';
import * as logger from '$lib/logger';
import { toISOString } from '$lib/date';
import { z } from 'zod';
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

function validateDate(dateParam: string) {
	const { success } = z.coerce
		.date()
		.min(new Date(0), { message: 'created_at must be after 1970-01-01' })
		.max(new Date(), { message: 'created_at must be before now' })
		.safeParse(dateParam);
	return success;
}

export const load: PageServerLoad = async ({ params, locals }) => {
	const session = await locals.getSession();
	if (!session || !session.user || !session.user.email) {
		throw redirect(302, '/welcome');
	}

	const date = getDateFromParam(params.date);
	logger.debug('date', date);
	if (!validateDate(date)) {
		throw error(404, { message: 'Date not found' });
	}

	const email = emailFromSession(await locals.getSession());
	if (!email) {
		logger.error('Email not present');
		throw error(500, { message: 'Internal error' });
	}

	return {
		async: {
			done_items: getDoneItemsForDate(email, date)
		},
		date
	};
};

export const actions: Actions = {
	create: async ({ request, params, locals }) => {
		const session = await locals.getSession();
		if (!session || !session.user || !session.user.email) {
			return fail(401, { user: 'Unauthorized' });
		}

		const date = getDateFromParam(params.date);
		logger.debug('date', date);
		validateDate(date);

		const form_data = Object.fromEntries(await request.formData());
		logger.info('creating done item: ', JSON.stringify(form_data));
		const newDoneItemResult = await newDoneItemRequest.safeParseAsync(form_data);
		if (!newDoneItemResult.success) {
			return {
				errors: newDoneItemResult.error.flatten().fieldErrors
			};
		}

		const email = emailFromSession(await locals.getSession());
		if (!email) {
			logger.error('Email not present');
			throw new Error('Email not present');
		}
		await createPostAt(email, newDoneItemResult.data.text, date);
		logger.info('created new item');
	},
	delete: async ({ request, locals }) => {
		const session = await locals.getSession();
		if (!session || !session.user || !session.user.email) {
			return fail(401, { user: 'Unauthorized' });
		}

		const data = Object.fromEntries(await request.formData());
		logger.info('deleting done item: ', JSON.stringify(data));
		const itemToDeleteParsed = await deleteItemRequest.safeParseAsync(data);
		if (!itemToDeleteParsed.success) {
			return {
				errors: itemToDeleteParsed.error.flatten().fieldErrors
			};
		}

		const email = emailFromSession(await locals.getSession());
		if (!email) {
			logger.error('Email not present');
			throw new Error('Email not present');
		}

		await deletePost(email, itemToDeleteParsed.data.uid);
		logger.info('deleted done item');
	}
};
