<script lang="ts">
    import { onMount } from 'svelte';

    interface GalleryItem {
        id: number;
        images: string[];
        description: string;
    }

    let isMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;

    let galleryItems: GalleryItem[] = [];

    function parseGalleryTxt(text: string): GalleryItem[] {
        const items = text.split('\n===\n').filter(item => item.trim());
        return items.map((item, index) => {
            const parts = item.split('\n---\n');
            const imageLines = parts[0].trim().split('\n').filter(line => line.trim());
            const description = parts[1]?.trim() || '';
            return {
                id: index + 1,
                images: imageLines,
                description
            };
        });
    }

    async function loadGalleryData() {
        const response = await fetch('/gallery.txt');
        const text = await response.text();
        galleryItems = parseGalleryTxt(text);
    }

    let hoveredItem: GalleryItem | null = null;
    let currentImageIndex: { [key: number]: number } = {};
    let imageTimers: { [key: number]: number } = {};

    function handleMouseEnter(item: GalleryItem) {
        hoveredItem = item;
        if (!currentImageIndex[item.id]) {
            currentImageIndex[item.id] = 0;
        }
        currentImageIndex = { ...currentImageIndex }; 
        
        if (item.images.length > 1) {
            cycleImages(item);
        }
    }

    function handleMouseLeave(item: GalleryItem) {
        hoveredItem = null;
        // Clear any running timers
        if (imageTimers[item.id]) {
            clearInterval(imageTimers[item.id]);
            delete imageTimers[item.id];
        }
        // Reset to first image
        currentImageIndex[item.id] = 0;
    }

    function cycleImages(item: GalleryItem) {
        if (imageTimers[item.id]) {
            clearInterval(imageTimers[item.id]);
        }

        if (item.images.length <= 1) return;

        imageTimers[item.id] = setInterval(() => {
            currentImageIndex[item.id] = (currentImageIndex[item.id] + 1) % item.images.length;
            currentImageIndex = { ...currentImageIndex }; // Trigger reactivity
        }, 2000); 
    }

    onMount(() => {
        // Load gallery data from txt file
        loadGalleryData().then(() => {
            // Initialize image indices after data loads
            galleryItems.forEach(item => {
                currentImageIndex[item.id] = 0;
            });
        });

        // Check if mobile on mount and set up resize listener
        const checkMobile = () => {
            isMobile = window.innerWidth <= 768;
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    });

    function formatDescription(description: string) {
        const parts = description.split(' --');
        if (parts.length === 0) return [];
        
        return parts.map((part, index) => ({
            isTitle: index === 0,
            text: part.trim()
        }));
    }
</script>

<div class="gallery-container">
    {#if isMobile}
        <div class="image-columns mobile-single-column">
            <div class="thumbnail-column">
                {#each galleryItems as item (item.id)}
                    <div 
                        class="gallery-item"
                        role="button"
                        tabindex="0"
                    >
                        <div class="image-container">
                            {#each item.images as image, index}
                                <img 
                                    src={image} 
                                    alt={item.description}
                                    class="gallery-image"
                                    class:active={index === 0}
                                />
                            {/each}
                        </div>
                        <div class="mobile-description">
                            {#each formatDescription(item.description) as part, index}
                                {#if part.isTitle}
                                    <h2>{part.text}</h2>
                                {:else}
                                    <p class="description-paragraph">{part.text}</p>
                                {/if}
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {:else}
        <div class="image-columns">
            <div class="thumbnail-column">
                {#each galleryItems.filter((_, i) => i % 2 === 0) as item (item.id)}
                    <div 
                        class="gallery-item"
                        role="button"
                        tabindex="0"
                        on:mouseenter={() => handleMouseEnter(item)}
                        on:mouseleave={() => handleMouseLeave(item)}
                    >
                        <div class="image-container">
                            {#each item.images as image, index}
                                <img 
                                    src={image} 
                                    alt={item.description}
                                    class="gallery-image"
                                    class:active={hoveredItem?.id === item.id ? currentImageIndex[item.id] === index : index === 0}
                                />
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
            
            <div class="thumbnail-column">
                {#each galleryItems.filter((_, i) => i % 2 === 1) as item (item.id)}
                    <div 
                        class="gallery-item"
                        role="button"
                        tabindex="0"
                        on:mouseenter={() => handleMouseEnter(item)}
                        on:mouseleave={() => handleMouseLeave(item)}
                    >
                        <div class="image-container">
                            {#each item.images as image, index}
                                <img 
                                    src={image} 
                                    alt={item.description}
                                    class="gallery-image"
                                    class:active={hoveredItem?.id === item.id ? currentImageIndex[item.id] === index : index === 0}
                                />
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
    <div class="description-column">
        <div class="description-content">
            {#if hoveredItem}
                <div class="description-text">
                    {#each formatDescription(hoveredItem.description) as part, index}
                        {#if part.isTitle}
                            <h2>{part.text}</h2>
                        {:else}
                            <p class="description-paragraph">{part.text}</p>
                        {/if}
                    {/each}
                </div>
            {:else}
                <h3>Hover on images</h3>
            {/if}
        </div>
    </div>
</div>

<style>
    .gallery-container {
        padding-top: 100px;
        width: 100%;
        display: grid;
        gap: 30px;
        grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    }

    .image-columns {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        width: 100%;
    }

    .thumbnail-column {
        display: flex;
        flex-direction: column;
        gap: 30px;
    }

    .gallery-item {
        position: relative;
        width: 100%;
        height:fit-content;
        cursor: pointer;
    }

    .mobile-description {
        display: none;
    }

    .image-container {
        position: relative;
        width: 100%;
        aspect-ratio: 3/4;
    }

    .gallery-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        transition: opacity 0.6s ease-in-out;
    }

    .gallery-image.active {
        opacity: 1;
        z-index: 1;
    }

    .description-column {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        width: 100%;
        height: 100%;
        align-self: start;
    }

    .description-content {
        position: sticky;
        top: 50px;
        padding-top: 20px;
    }

    .description-text {
        display: flex;
        flex-direction: column;
        gap: 1em;
    }

    .description-paragraph {
        margin: 0;
        white-space: pre-line;
    }

    @media (max-width: 768px) {
        .gallery-container {
            grid-template-columns: 1fr;
            gap: 10px;
        }
        .image-columns {
            grid-template-columns: 1fr;
        }
        .description-column {
            display: none;
        }
        .gallery-item {
            margin-bottom: 20px;
        }
        .mobile-description {
            display: block;
            margin-top: 15px;
            padding: 0 10px;
        }
        .mobile-description .description-paragraph {
            margin: 0 0 1em 0;
            white-space: pre-line;
        }
    }
</style>