<script lang="ts">
	import { page } from '$app/stores';
</script>

<div>
	<header>
		<div class="signedInStatus">
			<p class="nojs-show loaded">
				{#if $page.data.session}
					{#if $page.data.session.user?.image}
						<span style="background-image: url('{$page.data.session.user.image}')" class="avatar" />
					{/if}
					<span class="signedInText">
						<small>Signed in as</small><br />
						<strong>{$page.data.session.user?.email ?? $page.data.session.user?.name}</strong>
					</span>
					<a href="/auth/signout" class="button" data-sveltekit-preload-data="off">Sign out</a>
				{/if}
			</p>
		</div>
	</header>
	<slot />
</div>

<style>
	.nojs-show {
		opacity: 1;
		top: 0;
	}
	.signedInStatus {
		display: block;
		min-height: 4rem;
		width: 100%;
	}
	.loaded {
		position: relative;
		top: 0;
		opacity: 1;
		overflow: hidden;
		border-radius: 0 0 0.6rem 0.6rem;
		padding: 0.6rem 1rem;
		margin: 0;
		background-color: rgba(0, 0, 0, 0.05);
		transition: all 0.2s ease-in;
	}
	.signedInText,
	.signedInText {
		padding-top: 0rem;
		left: 4.6rem;
	}
	.avatar {
		border-radius: 2rem;
		float: left;
		height: 2.8rem;
		width: 2.8rem;
		background-color: white;
		background-size: cover;
		background-repeat: no-repeat;
	}
</style>
