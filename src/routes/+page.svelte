<script lang="ts">
    import Landing from '$lib/components/Landing.svelte';
    import Gallery from '$lib/components/Gallery.svelte';
    import { onMount } from 'svelte';

    let gallerySpan: HTMLSpanElement;
    let p5Container: HTMLDivElement;
    let loadingSpan: HTMLSpanElement;
    let captchaWrapper: HTMLDivElement;
    let captchaCaption: HTMLParagraphElement;
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

        // Check if already verified this session
        const alreadyVerified = sessionStorage.getItem('captchaVerified') === 'true';
        if (alreadyVerified) {
            if (captchaWrapper) captchaWrapper.style.display = 'none';
            if (loadingSpan) loadingSpan.style.display = 'none';
            return;
        }

        // Randomly select challenge script
        const challenges = [
            { script: '/p5/grid.js', containerId: 'p5-grid' },
            { script: '/p5/glasses.js', containerId: 'p5-glasses' }
        ];
        const selectedChallenge = challenges[Math.floor(Math.random() * challenges.length)];

        // Set the container ID to match the selected challenge
        if (p5Container) {
            p5Container.id = selectedChallenge.containerId;
        }

        // Listen for p5ChallengeLoaded to get caption from p5 file
        const handleChallengeLoaded = (event: Event) => {
            const customEvent = event as CustomEvent;
            if (captchaCaption && selectedChallenge.containerId === 'p5-grid') {
                captchaCaption.style.display = 'block';
                captchaCaption.innerHTML = `Select all squares with <b>${customEvent.detail.caption}</b>. Press <b>Enter</b> to submit.`;
            }
        };
        window.addEventListener('p5ChallengeLoaded', handleChallengeLoaded);

        // Show caption based on challenge (fallback for non-grid challenges)
        if (captchaCaption) {
            captchaCaption.style.display = 'block';
            if (selectedChallenge.containerId !== 'p5-grid') {
                captchaCaption.innerHTML = 'Slide to complete the puzzle';
            }
        }

        // Load challenge script first, then p5.js
        // p5 needs to find setup() and draw() when it initializes
        const challengeScript = document.createElement('script');
        challengeScript.src = selectedChallenge.script;
        challengeScript.onload = () => {
            const p5Script = document.createElement('script');
            p5Script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js';
            document.head.appendChild(p5Script);
        };
        document.head.appendChild(challengeScript);

        function loadingAnimation() {
            setTimeout(() => {
                if (p5Container) {
                    p5Container.style.visibility = 'hidden';
                    captchaWrapper.style.visibility = 'hidden';
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
                captchaWrapper.style.visibility = 'hidden';
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
                sessionStorage.setItem('captchaVerified', 'true');
                loadingAnimation();
                setTimeout(() => {
                    window.scrollTo(0, 0);
                    loadingSpan.style.visibility = 'hidden';
                    captchaWrapper.style.visibility = 'hidden';
                    gsap.to(window, {
                        delay: 1.5,
                        duration: 1.0,
                        scrollTo: gallerySpan,
                        ease: 'power2.inOut'
                    });
                }, 6000);
            } else {
                startCaptcha();
            }
        };

        window.addEventListener('p5Valid', handleP5Valid);

        return () => {
            clearInterval(checkP5Ready);
            window.removeEventListener('p5Valid', handleP5Valid);
            window.removeEventListener('p5ChallengeLoaded', handleChallengeLoaded);
        };
    });

</script>
<svelte:head>
    <title>Mike Grail</title>
</svelte:head>


<div class="captcha-wrapper" bind:this={captchaWrapper}>
    <p class="captcha-label">Mike Captcha</p>
    <div id="p5-challenge" class="p5-container" bind:this={p5Container}></div>
    <p class="captcha-caption" bind:this={captchaCaption}>Please wait</p>
</div>
<div id="loading-span" bind:this={loadingSpan}>
    <h3>Loading<span class="loading-dot">.</span><span class="loading-dot">.</span><span class="loading-dot">.</span></h3>
</div>
<Landing />

<span bind:this={gallerySpan}>
    <Gallery />
</span>

<style>
    .captcha-wrapper {
        background-color: var(--color-bg);
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        z-index: 99990;
        pointer-events: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
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

    .captcha-caption {
        max-width: 506px;
        text-align: center;
        word-wrap: break-word;
    }
</style>