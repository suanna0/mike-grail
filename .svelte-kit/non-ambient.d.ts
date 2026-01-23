
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/about" | "/api" | "/api/captcha" | "/api/captcha/start" | "/api/captcha/verify" | "/submit";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/about": Record<string, never>;
			"/api": Record<string, never>;
			"/api/captcha": Record<string, never>;
			"/api/captcha/start": Record<string, never>;
			"/api/captcha/verify": Record<string, never>;
			"/submit": Record<string, never>
		};
		Pathname(): "/" | "/about" | "/about/" | "/api" | "/api/" | "/api/captcha" | "/api/captcha/" | "/api/captcha/start" | "/api/captcha/start/" | "/api/captcha/verify" | "/api/captcha/verify/" | "/submit" | "/submit/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/gallery.txt" | "/p5/.DS_Store" | "/p5/assets/.DS_Store" | "/p5/assets/after_valid.png" | "/p5/assets/base.png" | "/p5/assets/before_valid.png" | "/p5/assets/glasses.png" | "/p5/assets/loading.png" | "/p5/assets/mike_captcha.png" | "/p5/assets/reload.png" | "/p5/captchaTemplate.js" | "/p5/glasses.js" | "/p5/grid.js" | string & {};
	}
}