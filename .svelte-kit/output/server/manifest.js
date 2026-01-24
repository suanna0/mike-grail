export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["gallery.txt","p5/.DS_Store","p5/assets/.DS_Store","p5/assets/after_valid.png","p5/assets/before_valid.png","p5/assets/cdg_red_base.png","p5/assets/cdg_red_solved.png","p5/assets/glasses.png","p5/assets/kapital_jacket_base.png","p5/assets/kapital_jacket_solved.png","p5/assets/loading.png","p5/assets/reload.png","p5/captchaTemplate.js","p5/glasses.js","p5/grid.js"]),
	mimeTypes: {".txt":"text/plain",".png":"image/png",".js":"text/javascript"},
	_: {
		client: {start:"_app/immutable/entry/start.C0BqvRzZ.js",app:"_app/immutable/entry/app.CmMg6ite.js",imports:["_app/immutable/entry/start.C0BqvRzZ.js","_app/immutable/chunks/DIqsVji7.js","_app/immutable/chunks/CyF6-Xog.js","_app/immutable/chunks/D46IKvaC.js","_app/immutable/chunks/C0WzV_g1.js","_app/immutable/entry/app.CmMg6ite.js","_app/immutable/chunks/CyF6-Xog.js","_app/immutable/chunks/CkAdUwA7.js","_app/immutable/chunks/n02RSbSe.js","_app/immutable/chunks/C0WzV_g1.js","_app/immutable/chunks/Bm3snW4G.js","_app/immutable/chunks/F6b9OAFo.js","_app/immutable/chunks/DoKfKMj9.js","_app/immutable/chunks/D46IKvaC.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/about",
				pattern: /^\/about\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/api/captcha/start",
				pattern: /^\/api\/captcha\/start\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/captcha/start/_server.js'))
			},
			{
				id: "/api/captcha/verify",
				pattern: /^\/api\/captcha\/verify\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/captcha/verify/_server.js'))
			},
			{
				id: "/submit",
				pattern: /^\/submit\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
