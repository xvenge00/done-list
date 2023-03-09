<script lang="ts">
	export let data: PageData;
	import { goto } from '$app/navigation';
	import moment from 'moment';
	import { toISOString } from '$lib/date';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	let error = '';

	let dateChanged = () => {
		console.log(`date changed: ${data.date}`);
		goto(`${data.date}/`);
	};

	let dayBefore = () => {
		let parsed_date = moment(data.date).toDate();
		parsed_date.setDate(parsed_date.getDate() - 1);
		let dayBeforeString = toISOString(parsed_date);
		goto(`${dayBeforeString}/`);
		console.log('day before');
	};

	let dayAfter = () => {
		let parsed_date = moment(data.date).toDate();
		parsed_date.setDate(parsed_date.getDate() + 1);
		let dayAfterString = toISOString(parsed_date);
		goto(`${dayAfterString}/`);
		console.log('day after');
	};
</script>

<title>Done list</title>

<div class="center">
	<div class="date">
		<button on:click={dayBefore}>&lt</button>
		<input class="date-picker" type="date" bind:value={data.date} on:change={dateChanged} />
		<button on:click={dayAfter}>&gt</button>
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

			error = '';
		}}
	>
		<!-- <input name="text" placeholder="Got out of bed?" class="input input-lg input-bordered" autocomplete="off" id="main-input" /> -->
		<input name="text" placeholder="Got out of bed?" class="text-input" autocomplete="off" />
		<!-- <input class="btn btn-lg btn-active btn-primary" type="submit" value="I've done this"/> -->
		<input class="done-button" type="submit" value="Done!" />
	</form>
	{#if error}
		<div class="error">
			<span class="error">{error}</span>
		</div>
	{/if}

	<div class="lists">
		<ul class="list">
			{#each data.done_items as item}
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
