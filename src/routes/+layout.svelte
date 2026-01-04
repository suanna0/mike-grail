<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class = "light-bg">
	<Nav />
{@render children()}
</div>
<div class = "dark-bg">
	<Footer />
</div>

<style>
	.light-bg {
		background-color: var(--color-bg);
		padding: 0px 75px;
		margin: 0;
		padding-bottom: 80px;
	}
	.dark-bg {
		background-color: #00ff00;
		padding: 0px 75px;  
		margin: 0;
	}
	
	@media (max-width: 768px) {
		.light-bg, .dark-bg {
			padding: 0px 10px;
		}
	}
</style>