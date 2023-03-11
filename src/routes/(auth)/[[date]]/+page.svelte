<script lang="ts">
	export let data: PageData;
	export let form;

	import { goto } from '$app/navigation';
	import moment from 'moment';
	import { toISOString } from '$lib/date';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	$: error = form && form.errors && 'text' in form.errors ? form.errors.text : '';
	let posting = false;

	let dateChanged = () => {
		console.log(`date changed: ${data.date}`);
		goto(`${data.date}/`);
	};

	const dayBefore = (date: string) => {
		let parsed_date = moment(date).toDate();
		parsed_date.setDate(parsed_date.getDate() - 1);
		return toISOString(parsed_date);
	};

	const dayAfter = (date: string) => {
		let parsed_date = moment(date).toDate();
		parsed_date.setDate(parsed_date.getDate() + 1);
		return toISOString(parsed_date);
	};

	const isTomorowInFuture = (date: string) => {
		let parsed_date = moment(date).toDate();
		parsed_date.setDate(parsed_date.getDate() + 1);
		let today = new Date();
		today.setHours(0, 0, 0, 0);
		return parsed_date > today;
	};
</script>

<title>Done list</title>

<div class="center">
	<div class="date">
		<a
			class="btn text-4xl"
			data-sveltekit-preload-data="hover"
			data-sveltekit-preload-code="eager"
			href={dayBefore(data.date)}>&lt</a
		>
		<input
			class="date"
			type="date"
			min="1970-01-01T00:00"
			max={toISOString(new Date())}
			bind:value={data.date}
			on:change={dateChanged}
		/>
		{#if !isTomorowInFuture(data.date)}<a
				class="btn text-4xl"
				data-sveltekit-preload-data="hover"
				data-sveltekit-preload-code="eager"
				href={dayAfter(data.date)}>&gt</a
			>{/if}
	</div>

	<form
		method="POST"
		class="in"
		action="?/create"
		use:enhance={({ data, cancel }) => {
			if (!data.get('text')) {
				error = 'Doing nothing is not wrong, but try submitting something';
				cancel();
				return;
			}

			posting = true;
			error = '';

			return ({ update }) => {
				posting = false;
				update();
			};
		}}
	>
		<input name="text" placeholder="Got out of bed?" class="text-input" autocomplete="off" />
		<input class="done-button" type="submit" value="Done!" />
	</form>
	{#if error}
		<div class="error">
			<span class="error">{error}</span>
		</div>
	{/if}

	{#if posting}
		posting...
	{/if}

	{#await data.async.done_items then done_items}
		<div class="lists">
			<ul class="list">
				{#each done_items as item}
					<li class="list-item">
						<div>
							<form class="line" method="POST" action="?/delete">
								<span class="text">{item.text}</span>
								<input type="hidden" name="uid" value={item.id} />
								<!-- <button aria-label="Mark as complete">x</button> -->
								<button class="btn btn-circle btn-outline">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4"
										color="red"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M6 18L18 6M6 6l12 12"
										/></svg
									>
								</button>
							</form>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	{/await}
</div>

<style>
	input.text-input {
		border: 10pt;
		background-color: black;
		color: white;
		border-radius: 15px;
		padding: 10px;
		margin: 10px;
		height: 64px;
		width: 100%;
	}

	input.done-button {
		background-color: rgb(198, 67, 67);
		border-color: black;
		color: white;
		margin: 10px;
		height: 64px;
		width: 64px;
		border-radius: 32px;
	}

	form.in {
		display: flex;
	}

	div.date {
		display: flex;
		margin: auto;
		width: 30%;
	}

	.date-picker {
		margin: auto;
	}

	.center {
		margin: auto;
		width: 100%;
	}

	div.lists {
		width: 100%;
	}

	ul.list {
		width: 100%;
	}

	li.list-item {
		height: 80px;
		margin: 20px 10px 20px 10px;
		padding: 20px;
		border-radius: 15px;
		background: linear-gradient(180deg, rgba(233, 233, 233, 1) 0%, rgba(255, 255, 255, 1) 100%);
		box-shadow: 2px 2px 8px;
	}

	form.line {
		display: flex;
	}

	span.text {
		margin: auto auto auto 0;
	}

	div.error {
		margin: auto;
		text-align: center;
		color: red;
	}
</style>
