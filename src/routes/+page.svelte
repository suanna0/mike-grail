<script lang="ts">
    import Landing from '$lib/components/Landing.svelte';
    import Gallery from '$lib/components/Gallery.svelte';
    import { onMount } from 'svelte';

    let gallerySpan: HTMLSpanElement;

    import gsap from 'gsap';
    import ScrollToPlugin from 'gsap/ScrollToPlugin';

    gsap.registerPlugin(ScrollToPlugin);

    onMount(() => {
    gsap.to(window, {
        delay: 1.5,
        duration: 1.0,
        scrollTo: gallerySpan,
        ease: 'power2.inOut'
    });
});

</script>
<svelte:head>
    <title>Mike Grail</title>
</svelte:head>
<Landing />
<span bind:this={gallerySpan}>
    <Gallery />
</span>

