<script lang="ts">
    import Landing from '$lib/components/Landing.svelte';
    import Gallery from '$lib/components/Gallery.svelte';
    import { onMount } from 'svelte';

    let gallerySpan: HTMLSpanElement;
    let p5Container: HTMLDivElement;
    let loadingSpan: HTMLSpanElement;
    import gsap from 'gsap';
    import ScrollToPlugin from 'gsap/ScrollToPlugin';

    gsap.registerPlugin(ScrollToPlugin);

    async function startCaptcha() {
        console.log('[Captcha] Starting captcha...');
        try {
            const response = await fetch('/api/captcha/start', { method: 'POST' });
            const data = await response.json();
            console.log('[Captcha] Got challengeId:', data.challengeId);
            if (data.challengeId && (window as any).setCaptchaChallengeId) {
                (window as any).setCaptchaChallengeId(data.challengeId);
                console.log('[Captcha] Challenge ID set in p5 sketch');
            } else {
                console.warn('[Captcha] Could not set challengeId - p5 not ready or no ID received');
            }
        } catch (error) {
            console.error('[Captcha] Failed to start captcha:', error);
        }
    }

    async function verifyCaptcha(detail: { challengeId: string; duration: number; moves: number; jitter: number; accuracy: number }) {
        console.log('[Captcha] Verifying with metrics:', detail);
        try {
            const response = await fetch('/api/captcha/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(detail)
            });
            const data = await response.json();
            console.log('[Captcha] Verification response:', data);
            if (data.ok) {
                console.log('[Captcha] ✓ Verification successful! Pass token:', data.passToken);
            } else {
                console.log('[Captcha] ✗ Verification failed');
            }
            return data.ok;
        } catch (error) {
            console.error('[Captcha] Failed to verify captcha:', error);
            return false;
        }
    }

    onMount(() => {
        const isMobile = window.innerWidth <= 850;

        function loadingAnimation() {
            setTimeout(() => {
                if (p5Container) {
                    p5Container.style.visibility = 'hidden';
                    window.scrollTo(0, 0);
                }
                loadingSpan.style.visibility = 'visible';
                gsap.from(loadingSpan.querySelector('h3'), {
                    opacity: 0,
                    duration: 1.0,
                    ease: 'power2.out'
                });
            }, 3000);
        }

        if (isMobile) {
            if (p5Container) {
                p5Container.style.visibility = 'hidden';
                loadingSpan.style.visibility = 'hidden';
            }
            window.scrollTo(0, 0);
            gsap.to(window, {
                delay: 1.5,
                duration: 1.0,
                scrollTo: gallerySpan,
                ease: 'power2.inOut'
            });
            return;
        }

        // Start captcha challenge when p5 is ready
        const checkP5Ready = setInterval(() => {
            if ((window as any).setCaptchaChallengeId) {
                clearInterval(checkP5Ready);
                startCaptcha();
            }
        }, 100);

        const handleP5Valid = async (event: Event) => {
            const customEvent = event as CustomEvent;
            const verified = await verifyCaptcha(customEvent.detail);
            if (verified) {
                loadingAnimation();
                setTimeout(() => {
                    loadingSpan.style.visibility = 'hidden';
                    gsap.to(window, {
                        delay: 1.5,
                        duration: 1.0,
                        scrollTo: gallerySpan,
                        ease: 'power2.inOut'
                    });
                }, 6000);
            } else {
                // Restart captcha on failure
                startCaptcha();
            }
        };

        window.addEventListener('p5Valid', handleP5Valid);

        return () => {
            clearInterval(checkP5Ready);
            window.removeEventListener('p5Valid', handleP5Valid);
        };
    });

</script>
<svelte:head>
    <title>Mike Grail</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
    <script src="/p5/mySketch.js"></script>
</svelte:head>


<div id="p5-container" bind:this={p5Container}></div>
<div id="loading-span" bind:this={loadingSpan}>
    <h3>Loading<span class="loading-dot">.</span><span class="loading-dot">.</span><span class="loading-dot">.</span></h3>
</div>
<Landing />

<span bind:this={gallerySpan}>
    <Gallery />
</span>

<style>
    #p5-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        z-index: 99990;
        pointer-events: auto;
    }

    #loading-span {
        background-color: var(--color-bg);
        visibility: hidden;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        z-index: 99999;
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #loading-span .loading-dot {
        display: inline-block;
        animation: dot-bounce 1.4s ease-in-out infinite;
    }

    #loading-span .loading-dot:nth-child(2) {
        animation-delay: 0.2s;
    }

    #loading-span .loading-dot:nth-child(3) {
        animation-delay: 0.4s;
    }

    #loading-span .loading-dot:nth-child(4) {
        animation-delay: 0.6s;
    }

    @keyframes dot-bounce {
        0%, 60%, 100% {
            transform: translateY(0);
        }
        30% {
            transform: translateY(-5px);
        }
    }
</style>