<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	let mikeSpan: HTMLSpanElement;
	let grailSpan: HTMLSpanElement;

	onMount(() => {
		gsap.from(mikeSpan, {
			opacity: 0,
			y: -50,
			duration: 1.0,
			ease: 'power2.out'
		});
		gsap.from(grailSpan, {
			opacity: 0,
			y: 50,
			delay: 0.4,
			duration: 1.0,
			ease: 'power2.out'
		});
	});
</script>

<section>
	<span bind:this={mikeSpan}><h1>Mike&nbsp;</h1></span><span bind:this={grailSpan}><h1>Grail</h1></span>
</section>

<style>
	section {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}

	@media only screen and (max-width: 850px) {
		section {
			padding: 0 5px;
		}
	}

</style>