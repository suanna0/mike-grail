import { U as ensure_array_like, V as attr_class, W as store_get, X as unsubscribe_stores, Y as bind_props, Z as head, _ as attr } from "../../chunks/index2.js";
import { g as getContext, e as escape_html } from "../../chunks/context.js";
import "clsx";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/state.svelte.js";
const favicon = "data:image/svg+xml,%3csvg%20width='83'%20height='83'%20viewBox='0%200%2083%2083'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M5.124%2035.136H9.372V38.988C10.308%2036.432%2012.324%2034.704%2015.276%2034.704C17.94%2034.704%2020.064%2036.144%2020.604%2039.528C21.432%2036.648%2023.52%2034.704%2026.688%2034.704C30.36%2034.704%2032.232%2037.404%2032.232%2041.76V54H27.912V42.948C27.912%2039.924%2026.724%2038.196%2024.42%2038.196C22.152%2038.196%2020.82%2039.924%2020.82%2042.948V54H16.5V42.948C16.5%2039.924%2015.312%2038.196%2013.044%2038.196C10.74%2038.196%209.444%2039.924%209.444%2042.948V54H5.124V35.136ZM36.3428%2028.188H40.6628V32.112H36.3428V28.188ZM36.3428%2035.136H40.6628V54H36.3428V35.136ZM44.8489%2027.864H49.1689V43.416L56.4049%2035.136H61.3369L53.9209%2043.056L62.1289%2054H57.1249L54.2449%2050.112C53.2009%2048.708%2052.1929%2047.304%2051.1849%2045.9L49.1689%2048.06V54H44.8489V27.864ZM78.9811%2045.036H65.9491C66.1291%2049.068%2068.2171%2051.12%2071.0251%2051.12C73.4371%2051.12%2074.9131%2049.572%2075.3091%2047.736H79.0171C78.4411%2051.696%2075.2731%2054.432%2070.8811%2054.432C65.4811%2054.432%2061.5931%2050.544%2061.5931%2044.568C61.5931%2038.592%2065.5171%2034.704%2070.7731%2034.704C76.4971%2034.704%2079.2691%2038.988%2078.9811%2045.036ZM70.8091%2037.764C68.3971%2037.764%2066.7411%2039.276%2066.1651%2042.156H74.9491C74.5531%2038.916%2072.7891%2037.764%2070.8091%2037.764Z'%20fill='white'/%3e%3c/svg%3e";
const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function Nav($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const navItems = [
      { label: "Mike Grail", path: "/" },
      { label: "About", path: "/about" }
    ];
    $$renderer2.push(`<nav class="svelte-1h32yp1"><div class="nav-inner svelte-1h32yp1"><!--[-->`);
    const each_array = ensure_array_like(navItems);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let item = each_array[$$index];
      $$renderer2.push(`<button${attr_class("svelte-1h32yp1", void 0, {
        "active": store_get($$store_subs ??= {}, "$page", page).url.pathname === item.path
      })}><p>${escape_html(item.label)}</p></button>`);
    }
    $$renderer2.push(`<!--]--></div></nav>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function Footer($$renderer, $$props) {
  const title = "Footer";
  $$renderer.push(`<footer class="svelte-jz8lnl"><button class="button svelte-jz8lnl">Back to Top ↑</button></footer>`);
  bind_props($$props, { title });
}
function _layout($$renderer, $$props) {
  let { children } = $$props;
  head("12qhfyh", $$renderer, ($$renderer2) => {
    $$renderer2.push(`<link rel="icon"${attr("href", favicon)}/>`);
  });
  $$renderer.push(`<div class="light-bg svelte-12qhfyh">`);
  Nav($$renderer);
  $$renderer.push(`<!----> `);
  children($$renderer);
  $$renderer.push(`<!----></div> <div class="dark-bg svelte-12qhfyh">`);
  Footer($$renderer, {});
  $$renderer.push(`<!----></div>`);
}
export {
  _layout as default
};
