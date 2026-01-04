<script lang="ts">
    import { onMount } from 'svelte';

    interface GalleryItem {
        id: number;
        images: string[];
        description: string;
    }

    let isMobile = false;

    let galleryItems: GalleryItem[] = [
        {
            id: 1,
            images: [
                "https://de1wwae7728z6.cloudfront.net/images/mike-grail/kapital_grad_main.jpg",
                "https://de1wwae7728z6.cloudfront.net/images/mike-grail/kapital_grad_detail.jpg"
            ],
            description: 
            "Kapital Kathmandu Patchwork Shirt --I wore this shirt for my graduation. Its mismatched buttons and interesting patchwork intrigued me so much so that I immediately sent links of it to a couple friends joking that it would make a super lit grad shirt. That turned out to not be a joke. --The funny thing about this shirt though, is that to this day I do not know if it is real or not. I purchased it from Grailed, but have since seen the shirt in a local shop that carries Kapital pieces. The in-store piece felt a lot different in terms of both fabric texture and key details, including the exact mismatched buttons used and the degree of distressing on the hems. After seeing the 'legit' piece in person I had a little crisis not knowing if I was scammed, but I am now over it. --This item was supposed to be part of season 1 but was unintentionally left out. Acquired April 28, 2025. "
        },
        {
            id: 2,
            images: [
                "https://de1wwae7728z6.cloudfront.net/images/mike-grail/tt_back.jpg",
                "https://de1wwae7728z6.cloudfront.net/images/mike-grail/tt_main.jpg"
            ],
            description: 
            "Taiga Takahashi Lot. 704 Denim Trousers C. 1920's - Raw Indigo --I purchased this pair of denim on my recent trip to Japan with Sally and Akshat. I had previously heard the brand name being thrown around on various online spaces but only really looked into their work in the last couple months. Visually, what drew me into this particular pair was the suspender button detail all around the waistband. As I read the item description on their website, I began to get a sense of the brand's ethos and their commitment to quality and craftsmanship. --This sentiment was further reinforced when I visted their location in Kyoto. Being in that space was a truly unique experience and if presented with the opportunity, I would highly recommend everyone to visit it. I also encourage everyone to read the story of these pants (and all the other pieces by T.T) on their website. The techniques used and original inspiration are all quite interesting, and have definitely given me a deeper appreciation for this item. --These pants are quite long and unfortunately I am not very tall. They are selvedge denim. Acquired August 26, 2025."            },
        {
            id: 3,
            images: [
                "https://de1wwae7728z6.cloudfront.net/images/mike-grail/cdg_red_main.jpg",
                "https://de1wwae7728z6.cloudfront.net/images/mike-grail/cdg_red_detail.jpg"
            ],
            description: 
            "COMME des GARÇONS Homme Plus Red Panelled T-Shirt --One of my favorite things that COMME des GARÇONS does is their use of panelling with different fabrics and patterns combined together to make super unique pieces. I was on the hunt for a more formal dress shirt with that sort of design while in Japan but had no luck finding any that fit me or were understated enough for wear in a work environment. I came across this piece at 10tow in Shibuya and knew I had to get it when I tried it on. --Even though it wasn't the dress shirt that I envisioned myself purchasing, I still love this shirt and all its details - the mixing of polyester and cotton panels, ringer sleeve detail, and how the two shades of red look next to each other. I had been looking at somewhat similar shirts on Grailed for a while and decided that this one was a bargain, given not only its price but also its condition. I believe it is from S/S 2003 according to the label.  --I am not sure if this means I now own archive CDG. Acquired August 24, 2025. "
        },
        {
            id: 4,
            images: [
                "https://de1wwae7728z6.cloudfront.net/images/mike-grail/gentle_monster_main.jpg",
                "https://de1wwae7728z6.cloudfront.net/images/mike-grail/gentle_monster_detail.jpg"
            ],
            description: 
            "Gentle Monster Lutto 01 --These glasses were purchased via the most interesting shopping experience I have ever undergone. They are from ZZER, a secondhand designer consigment chain in China. When you enter, (if you have a bag) you are directed to a locker area to stow it. Then you are given gloves so as to keep all the items clean. The gloves have thumb and index finger holes for easy phone use, which is important because every item has a QR code, that when scanned takes users to the listing of the item on their app, complete with information about price, condition, what sort of original packaging the item comes with etc. The place was built like a warehouse with rows of metal racks that housed an obscene number of designer bags (all in little cubbies tucked sideways), clothes, and cases of accessories.  --I tried this pair on at the Shenzhen location. They also had a pair of the Margiela collaboration (M113 I believe) in stock and I was very tempted to get those. Virtually no one who voted on my Instagram poll (between these and the Margiela) liked the Margiela on me so I ended up not getting them. I passed on this pair my first visit but I went back the next day to purchase them. The main reason why I went back for them was because this particular model is not made anymore. The other (less important) reason was beccause they were priced slightly under retail. --The lenses on these glasses are not prescription. Acquired September 11, 2025. "        },
        {
            id: 5,
            images: [
                "https://de1wwae7728z6.cloudfront.net/images/mike-grail/yang_hat_main.jpg"
            ],
            description: 
            "杨 hat --Suanna knitted me this hat. The character on its face is my last name in Chinese. She began working on this project a long time ago - at this point neither of us remember when. I am so thankful for my friends because the time, energy, and thought that went into this are priceless.  --Apart from the texture of the mohair and the fun colors on this hat, I also love how cool it makes my last name look. Growing up I didn't like how my last name sounded in English, nor did I really like it in Chinese because it is a homophone of the word for sheep. But none of that matters because it looks so dope on my head. I can't wait to wear it when it's colder out/when I move to New York. I have had this hat since August 2025."
        },
        {
            id: 6,
            images: [
                "https://de1wwae7728z6.cloudfront.net/images/mike-grail/snufkin_main.jpg",
                "https://de1wwae7728z6.cloudfront.net/images/mike-grail/snufkin_detail.jpg"
            ],
            description: 
            "Kapital No. 6 Canvas Snufkin Bag - Kinari --Sally and Suanna kindly gifted me this bag to celebrate my graduation. Again, I am really thankful for my friends, but this was a bit excessive. Since my first trip to Japan, I had been eyeing the bag but I had already dropped a bag on a jacket during that trip so I couldn't justify dropping another bag on this bag.  --Regardless, I love how interactive this bag is - it comes flat and you fasten three buckles to make it functional. It holds a lot of things, more than I expected. I am afraid to get it dirty because it is a light color. The bag was purchased from Grailed. I have had this bag since June 2025."        
        },
        {
            id: 7,
            images: [
                "https://de1wwae7728z6.cloudfront.net/images/mike-grail/brown_main.jpg",
                "https://de1wwae7728z6.cloudfront.net/images/mike-grail/brown_detail.jpg",
                "https://de1wwae7728z6.cloudfront.net/images/mike-grail/brown_jump.jpg"
            ],
            description: 
            "Needles H.D. Track Pant - Poly Smooth Dark Brown --I first saw this kind of pant on @rydennoah's YouTube channel. I was intrigued by their shape and construction and began doing a little bit of research on them. Eventually, I found my size on a site called HAVEN. When they came in the mail, I was a bit thrown off by the color (because they are supposedly brown - however due to color theory or perhaps the fact that they are actually just purple tinged, they appear slightly purple) but I was so excited to own a pair of the famed H.D. track pants that I kept them anyways.  --I love how huge they are and how they accentuate my dancing (when I dance in them). At first, I felt a little crazy for spending so much money on straight polyester, but I don't feel that way anymore. I have had these pants since December 2024. "
        },
        {
            id: 8,
            images: [
                "https://de1wwae7728z6.cloudfront.net/images/mike-grail/type_i_main.jpg",
                "https://de1wwae7728z6.cloudfront.net/images/mike-grail/type_i_detail.jpg",
                "https://de1wwae7728z6.cloudfront.net/images/mike-grail/type_i_back.jpg"
            ],
            description: 
            "Kapital Twill Aging-Wool 1st Jacket - Faded Charcoal --This is my first Kapital piece. I bought it at the Tokyo Naked Store during my first trip to Japan. I knew I wanted to find something in the neighborhood of a denim jacket during my time there, and when I came across this piece, I knew it was the one. The sales associate definitely planted some seeds in my head to get me to buy it - he said it was the only one of its size left in stores (my size was in stock online) (I guess I couldn't have it shipped to me anyways because we were only in Japan for a couple more days) but I do not blame him one bit.  --Modeled after the Levi's Type 1 jacket, it has all the characteristics of the jean jacket I was looking for, but with a softer touch and less country Americana energy that fits better into my style. I love the contrast stitching around all the hems that give it this sort of aged look without being worn. I am scared to get it wet because it is made of wool. One time I was caught in the rain with it without an umbrella. Luckily I escaped and the jacket is fine. I hope I never have to wash it. On that trip, Suanna ended up getting the same jacket but in the red colorway in Kyoto. I have had this jacket since December 2024. "
        },
        {
            id: 9,
            images: [
                "https://de1wwae7728z6.cloudfront.net/images/mike-grail/cdg_detail.jpg",
            ],
            description: 
            "Mystery CDG --This piece is from 2nd Street in Stanton. That day I was only really looking for some kind of sweater because I had forgotten to bring one with me on that trip, but when I saw this piece in store, I couldn't pass it up. I am an avid user of Google Lens and could not find anything about it, hence I do not know the official name of this item.  --The main reasons for my purchase were a combination of the uniqueness of the piece and the fact that it had the 'original' tags on it. Afterwards, I realized that the tag fasteners for the 'original' tags and the 2nd Street merchandise tag were all the same so they probably put it on themselves. 2nd Street won that day. The price was also crazy below 'retail,' which further convinced me to get it. Usually, I wouldn't go for a graphic that's as ridiculous as the entire alphabet on my back, but the stitching on the inside of each letter was so interesting and well done that I could not pass up on the piece. The cuffs also have a sort of irregular cinching to them that I find to be a fun detail. I have had this top since June 2025. "
        },
        {
            id: 10,
            images: [
                "https://de1wwae7728z6.cloudfront.net/images/mike-grail/orange_asics_main.jpg",
                "https://de1wwae7728z6.cloudfront.net/images/mike-grail/orange_asics_detail.jpg"
            ],
            description: 
            "LTTT ASICS Training Pant - Orange --LTTT recently celebrated their fourth birthday, so accordingly I had to celebrate with them by making this purchase. I was in LA on the day of their birthday party but was not near the area so I did not make it to the TikTok fashion mf meetup of the century.  --Every colorway of the pant was stunning, but I purchased the orange pair because I wanted to live out my highlighter kid dreams. It was definitely a decision, one that I don't know if I can completely stand behind to this day, but I like to think of it as exposure therapy and embracing taking up (visual) space in the world. There are many cool details on the pants, but the panelling of various colors and materials stand out to me in particular. I have had these pants since July 2025. "
        },
        {   
            id: 11,
            images: [
                "https://de1wwae7728z6.cloudfront.net/images/mike-grail/century_main.jpg",
                "https://de1wwae7728z6.cloudfront.net/images/mike-grail/century_detail.jpg"
            ],
            description: 
            "Kapital Century Denim No.9 Book Bag --I got this bag at 2nd Street in Costa Mesa at The Camp on a trip to OC with Sally. It was an impulse purchase because I had never actually seen the bag before but I am glad I got it. It has Kapital’s signature sashiko stitching all throughout which adds a really nice texture. The price was quite good compared to retail in the US.  --Before purchasing it, I FaceTimed Suanna and Teresa, but only Suanna was in support of me getting it. Sally really wanted me to get it because she knew if I didn’t get the bag I wouldn’t stop talking about it all night and she did NOT want to hear any of that. I am glad she had that sentiment. It goes with basically every outfit and is loud enough to let those who know that I am flexing on them, but subtle enough that the big graphic words make an otherwise plain outfit interesting to the average person. I have had this bag since January 2025. "
        },
        {
            id: 12,
            images: [
                "https://de1wwae7728z6.cloudfront.net/images/mike-grail/plaid_ltttt_main.jpg",
                "https://de1wwae7728z6.cloudfront.net/images/mike-grail/plaid_ltttt_detail.jpg",
                "https://de1wwae7728z6.cloudfront.net/images/mike-grail/plaid_ltttt_detail_2.jpg"
            ],
            description: 
            "LTTT Bungee Pants V.3 - Black --These pants were part of the aforementioned birthday celebration. I had seen these pants on their site a while ago when they first dropped and always really liked the plaid pocket detail. Initially, I wasn't super crazy about the bungee cinching detail, but that has since become my favorite part about these pants.  --It took a little longer for this pair to arrive than it did for the ASICS pair because they originally sent me the black ASICS pants, which I desperately wanted to keep. LTTT's customer service was very nice and personable - it felt quite pleasant coordinating the exchange. They even sent me a super cool tote to make up for the mixup. Much love to Kyle Chen. I have had these pants since August 2025. "
        }
    ];

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
        // Initialize image indices
        galleryItems.forEach(item => {
            currentImageIndex[item.id] = 0;
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
    <div class="image-columns">
        <div class="thumbnail-column">
            {#each galleryItems.filter((_, i) => i % 2 === 0) as item (item.id)}
                <div 
                    class="gallery-item"
                    role="button"
                    tabindex="0"
                    on:mouseenter={() => !isMobile && handleMouseEnter(item)}
                    on:mouseleave={() => !isMobile && handleMouseLeave(item)}
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
        
        <div class="thumbnail-column">
            {#each galleryItems.filter((_, i) => i % 2 === 1) as item (item.id)}
                <div 
                    class="gallery-item"
                    role="button"
                    tabindex="0"
                    on:mouseenter={() => !isMobile && handleMouseEnter(item)}
                    on:mouseleave={() => !isMobile && handleMouseLeave(item)}
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
                <p class="description-text placeholder">
                    Hover on images</p>
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
        top: 20px;
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

    .description-text.placeholder {
        color: var(--color-text-grey);
        font-style: italic;
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