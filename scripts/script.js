document.addEventListener("DOMContentLoaded", () => {
  const infoText = document.querySelector(".asset-desc");

  // DESKTOP: Hover-to-show descriptions
  function setupHoverDescriptions(elements) {
    elements.forEach((el) => {
      const desc = el.getAttribute("data-desc");

      el.addEventListener("mouseenter", () => {
        // Example: data-desc="Asset Name – Other info here"
        const parts = desc.split("–").map(s => s.trim());

        // Clear existing content
        infoText.innerHTML = "";

        // Create and append h2 for asset name (first part)
        const h2 = document.createElement("h2");
        h2.textContent = parts[0];
        infoText.appendChild(h2);

        // Create and append p for each remaining part
        for (let i = 1; i < parts.length; i++) {
          const p = document.createElement("p");
          p.textContent = parts[i];
          infoText.appendChild(p);
        }
      });

      el.addEventListener("mouseleave", () => {
        // Reset to default text or whatever structure you want
        infoText.innerHTML = "<h2>NAME</h2><p>desc</p>";
      });
    });
  }


  const hoverImages = document.querySelectorAll(".gallery img");
  const hoverVideos = document.querySelectorAll("video");
  setupHoverDescriptions(hoverImages);
  setupHoverDescriptions(hoverVideos);

  // Image fade-in and lazy styling
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

  // VIDEO: Lazy load with IntersectionObserver
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

  // "Go to Top" button logic
  const goToTopBtn = document.getElementById("goToTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      goToTopBtn.style.display = "inline";
    } else {
      goToTopBtn.style.display = "none";
    }
  });

  goToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});
