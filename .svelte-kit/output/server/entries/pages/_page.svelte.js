import { U as ensure_array_like, _ as attr, V as attr_class, Z as head } from "../../chunks/index2.js";
import "clsx";
import { e as escape_html } from "../../chunks/context.js";
import gsap from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";
function Landing($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<section class="svelte-10joqin"><span><h1>Mike </h1></span><span><h1>Grail</h1></span></section>`);
  });
}
function Gallery($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let isMobile = typeof window !== "undefined" ? window.innerWidth <= 768 : false;
    let galleryItems = [];
    let hoveredItem = null;
    let currentImageIndex = {};
    function formatDescription(description) {
      const parts = description.split(" --");
      if (parts.length === 0) return [];
      return parts.map((part, index) => ({ isTitle: index === 0, text: part.trim() }));
    }
    $$renderer2.push(`<div class="gallery-container svelte-1oz3msq">`);
    if (isMobile) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="image-columns mobile-single-column svelte-1oz3msq"><div class="thumbnail-column svelte-1oz3msq"><!--[-->`);
      const each_array = ensure_array_like(galleryItems);
      for (let $$index_2 = 0, $$length = each_array.length; $$index_2 < $$length; $$index_2++) {
        let item = each_array[$$index_2];
        $$renderer2.push(`<div class="gallery-item svelte-1oz3msq" role="button" tabindex="0"><div class="image-container svelte-1oz3msq"><!--[-->`);
        const each_array_1 = ensure_array_like(item.images);
        for (let index = 0, $$length2 = each_array_1.length; index < $$length2; index++) {
          let image = each_array_1[index];
          $$renderer2.push(`<img${attr("src", image)}${attr("alt", item.description)}${attr_class("gallery-image svelte-1oz3msq", void 0, { "active": index === 0 })}/>`);
        }
        $$renderer2.push(`<!--]--></div> <div class="mobile-description svelte-1oz3msq"><!--[-->`);
        const each_array_2 = ensure_array_like(formatDescription(item.description));
        for (let index = 0, $$length2 = each_array_2.length; index < $$length2; index++) {
          let part = each_array_2[index];
          if (part.isTitle) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<h2>${escape_html(part.text)}</h2>`);
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`<p class="description-paragraph svelte-1oz3msq">${escape_html(part.text)}</p>`);
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="image-columns svelte-1oz3msq"><div class="thumbnail-column svelte-1oz3msq"><!--[-->`);
      const each_array_3 = ensure_array_like(galleryItems.filter((_, i) => i % 2 === 0));
      for (let $$index_4 = 0, $$length = each_array_3.length; $$index_4 < $$length; $$index_4++) {
        let item = each_array_3[$$index_4];
        $$renderer2.push(`<div class="gallery-item svelte-1oz3msq" role="button" tabindex="0"><div class="image-container svelte-1oz3msq"><!--[-->`);
        const each_array_4 = ensure_array_like(item.images);
        for (let index = 0, $$length2 = each_array_4.length; index < $$length2; index++) {
          let image = each_array_4[index];
          $$renderer2.push(`<img${attr("src", image)}${attr("alt", item.description)}${attr_class("gallery-image svelte-1oz3msq", void 0, {
            "active": hoveredItem?.id === item.id ? currentImageIndex[item.id] === index : index === 0
          })}/>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="thumbnail-column svelte-1oz3msq"><!--[-->`);
      const each_array_5 = ensure_array_like(galleryItems.filter((_, i) => i % 2 === 1));
      for (let $$index_6 = 0, $$length = each_array_5.length; $$index_6 < $$length; $$index_6++) {
        let item = each_array_5[$$index_6];
        $$renderer2.push(`<div class="gallery-item svelte-1oz3msq" role="button" tabindex="0"><div class="image-container svelte-1oz3msq"><!--[-->`);
        const each_array_6 = ensure_array_like(item.images);
        for (let index = 0, $$length2 = each_array_6.length; index < $$length2; index++) {
          let image = each_array_6[index];
          $$renderer2.push(`<img${attr("src", image)}${attr("alt", item.description)}${attr_class("gallery-image svelte-1oz3msq", void 0, {
            "active": hoveredItem?.id === item.id ? currentImageIndex[item.id] === index : index === 0
          })}/>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    }
    $$renderer2.push(`<!--]--> <div class="description-column svelte-1oz3msq"><div class="description-content svelte-1oz3msq">`);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<h3>Hover on images</h3>`);
    }
    $$renderer2.push(`<!--]--></div></div></div>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    gsap.registerPlugin(ScrollToPlugin);
    head("1uha8ag", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Mike Grail</title>`);
      });
    });
    $$renderer2.push(`<div class="captcha-wrapper svelte-1uha8ag"><p class="captcha-label svelte-1uha8ag">Mike Captcha</p> <div id="p5-challenge" class="p5-container svelte-1uha8ag"></div> <p class="captcha-caption svelte-1uha8ag">Select all squares with a grail</p></div> <div id="loading-span" class="svelte-1uha8ag"><h3 class="svelte-1uha8ag">Loading<span class="loading-dot svelte-1uha8ag">.</span><span class="loading-dot svelte-1uha8ag">.</span><span class="loading-dot svelte-1uha8ag">.</span></h3></div> `);
    Landing($$renderer2);
    $$renderer2.push(`<!----> <span class="svelte-1uha8ag">`);
    Gallery($$renderer2);
    $$renderer2.push(`<!----></span>`);
  });
}
export {
  _page as default
};
