document.addEventListener("DOMContentLoaded", () => {
  const infoText = document.querySelector(".asset-desc");
  const hoverImages = document.querySelectorAll(".gallery img");
  const hoverVideos = document.querySelectorAll("video");
  const mediaElements = [...hoverImages, ...hoverVideos];

  // --- TOGGLE (swap desc + image) ---
  const toggleBtn = document.getElementById("toggleBtn");
  const img1 = document.getElementById("img-j");
  const img2 = document.getElementById("img-srs");
  const desc1 = document.getElementById("bio-j");
  const desc2 = document.getElementById("bio-srs");

  // helper to check visibility even if style="" is unset
  const isShown = (el) => el && window.getComputedStyle(el).display !== "none";

  // ensure both pairs exist before wiring the toggle
  if (toggleBtn && img1 && img2 && desc1 && desc2) {
    // initialize to current CSS state (fallback: show first)
    function setToggle(showFirst) {
      desc1.style.display = showFirst ? "block" : "none";
      desc2.style.display = showFirst ? "none" : "block";
      img1.style.display  = showFirst ? "block" : "none";
      img2.style.display  = showFirst ? "none" : "block";
    }

    // force any active hover-cycles to reset before hiding
    function resetHoverCycle(el) {
      if (!el) return;
      el.dispatchEvent(new Event("mouseleave"));
    }

    // keep current state or default to first visible
    const startFirst = isShown(desc1) || !isShown(desc2);
    setToggle(startFirst);

    toggleBtn.addEventListener("click", () => {
      // reset cycles on both before flipping
      resetHoverCycle(img1);
      resetHoverCycle(img2);
      const nextShowFirst = !isShown(desc1);
      setToggle(nextShowFirst);
    });
  }

  let isMobile = window.innerWidth < 768;

  // --- Description handling ---
  function createDescElements(desc) {
    const parts = desc.split("–").map(s => s.trim());
    const wrapper = document.createElement("div");
    wrapper.classList.add("mobile-desc");

    const h3 = document.createElement("h3");
    h3.textContent = parts[0];
    wrapper.appendChild(h3);

    for (let i = 1; i < parts.length; i++) {
      const p = document.createElement("p");
      p.textContent = parts[i];
      wrapper.appendChild(p);
    }
    return wrapper;
  }

  function setupDescriptions() {
    mediaElements.forEach((el) => {
      const desc = el.getAttribute("data-desc");

      const next = el.nextElementSibling;
      if (next && next.classList.contains("mobile-desc")) {
        next.remove();
      }

      if (desc) {
        if (isMobile) {
          const descEl = createDescElements(desc);
          el.parentNode.insertBefore(descEl, el.nextSibling);
        } else {
          el.onmouseenter = () => {
            const parts = desc.split("–").map(s => s.trim());
            infoText.innerHTML = "";

            const h3 = document.createElement("h3");
            h3.textContent = parts[0];
            infoText.appendChild(h3);

            for (let i = 1; i < parts.length; i++) {
              const p = document.createElement("p");
              p.textContent = parts[i];
              infoText.appendChild(p);
            }
          };

          el.onmouseleave = () => {
            infoText.innerHTML = "<h3>NAME</h3><p>desc</p>";
          };
        }
      }
    });
  }

  setupDescriptions();

  window.addEventListener("resize", () => {
    const wasMobile = isMobile;
    isMobile = window.innerWidth < 768;
    if (wasMobile !== isMobile) setupDescriptions();
  });

  // --- Image fade-in classes for gallery ---
  hoverImages.forEach((img, index) => {
    img.classList.add("fade-in");

    if (img.complete) {
      img.classList.add("loaded");
    } else {
      img.addEventListener("load", () => img.classList.add("loaded"));
    }

    if (index >= 4) {
      img.classList.add("loading-monitored");
    }
  });

  // --- Hover cycle (immediate first swap, then 4000ms) ---
  function fadeSwap(img, newSrc) {
    gsap.to(img, {
      opacity: 0,
      duration: 0.8,
      onComplete: () => {
        img.src = newSrc;
        gsap.to(img, { opacity: 1, duration: 0.5 });
      }
    });
  }

  function attachHoverCycle(img) {
    const altSrcs = img.getAttribute("data-alt-srcs");
    if (!altSrcs) return;

    // use current src as the base (so it respects toggled images too)
    const sources = [img.getAttribute("src"), ...altSrcs.split(",").map(s => s.trim())];
    let idx = 0;
    let interval;

    img.addEventListener("mouseenter", () => {
      // immediate first change
      idx = (idx + 1) % sources.length;
      fadeSwap(img, sources[idx]);

      interval = setInterval(() => {
        idx = (idx + 1) % sources.length;
        fadeSwap(img, sources[idx]);
      }, 4000);
    });

    img.addEventListener("mouseleave", () => {
      clearInterval(interval);
      idx = 0;
      fadeSwap(img, sources[0]); // reset to original
    });
  }

  // attach to any image that declares alternates (gallery + toggled ones)
  document.querySelectorAll('img[data-alt-srcs]').forEach(attachHoverCycle);

  // --- VIDEO: Lazy load + play/pause on view ---
  const videoContainers = document.querySelectorAll("[data-video-container]");
  const initialLoadCount = 2;

  const loadObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const container = entry.target;
        const video = container.querySelector("video");
        loadVideo(video, container);
        loadObserver.unobserve(container);
      }
    });
  }, { rootMargin: "200px 0px" });

  const playbackObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (video.getAttribute("src")) {
        if (entry.isIntersecting) {
          video.play().catch(e => console.log("Autoplay prevented:", e));
        } else {
          video.pause();
        }
      }
    });
  }, { threshold: 0.2 });

  function loadVideo(video, container) {
    const videoSrc = video.getAttribute("data-src");
    if (videoSrc) {
      video.src = videoSrc;
      video.classList.add("fade-in");

      video.addEventListener("loadeddata", () => {
        container.classList.remove("placeholder");
        container.querySelector(".loading-indicator")?.remove();

        video.classList.add("loaded");
        playbackObserver.observe(video);

        if (isElementInViewport(video)) {
          video.play().catch(e => console.log("Autoplay prevented:", e));
        }
      });

      video.load();
    }
  }

  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  videoContainers.forEach((container, i) => {
    const video = container.querySelector("video");
    if (i < initialLoadCount) {
      loadVideo(video, container);
    } else {
      loadObserver.observe(container);
    }
  });

  // Preconnect for CDNs
  ["cdn.glitch.global", "cdn.glitch.me"].forEach(domain => {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = `https://${domain}`;
    document.head.appendChild(link);
  });

  // --- Scroll to top ---
  const goToTopBtn = document.getElementById("goToTop");
  if (goToTopBtn) {
    goToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});

// --- GSAP Animations ---
gsap.registerPlugin(ScrollTrigger);

gsap.from("#Mike", {
  opacity: 0,
  y: -100,
  duration: 1,
  ease: "power3.out"
});

gsap.from("#Grail", {
  opacity: 0,
  y: 30,
  delay: 0.4,
  duration: 1,
  ease: "power3.out"
});

gsap.from("#Thats-Right", {
  opacity: 0,
  y: -100,
  duration: 1,
  ease: "power3.out"
});

gsap.from("#Im-Mike", {
  opacity: 0,
  y: 30,
  delay: 0.8,
  duration: 1,
  ease: "power3.out"
});

// Auto scroll down after intro
gsap.delayedCall(2, () => {
  gsap.to(window, {
    scrollTo: "#mainSite",
    duration: 1,
    ease: "power3.inOut"
  });
});

gsap.to("#downArrow", {
  opacity: 1,
  delay: 3,
  duration: 1,
  ease: "power2.out"
});

const downArrowEl = document.getElementById("downArrow");
if (downArrowEl) {
  downArrowEl.addEventListener("click", () => {
    gsap.to(window, {
      scrollTo: "#mainSite",
      duration: 1,
      ease: "power2.inOut"
    });
  });
}

gsap.utils.toArray("img").forEach((imgEl) => {
  gsap.from(imgEl, {
    scrollTrigger: { trigger: imgEl, start: "top 80%" },
    y: 20,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });
});

gsap.utils.toArray("video").forEach((videoEl) => {
  gsap.from(videoEl, {
    scrollTrigger: { trigger: videoEl, start: "top 80%" },
    y: 20,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });
});
