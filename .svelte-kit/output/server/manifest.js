export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.CAJtHh2O.js",app:"_app/immutable/entry/app.Bs4pr_jj.js",imports:["_app/immutable/entry/start.CAJtHh2O.js","_app/immutable/chunks/D_6ZYLMD.js","_app/immutable/chunks/CyF6-Xog.js","_app/immutable/chunks/D46IKvaC.js","_app/immutable/chunks/C0WzV_g1.js","_app/immutable/entry/app.Bs4pr_jj.js","_app/immutable/chunks/CyF6-Xog.js","_app/immutable/chunks/CkAdUwA7.js","_app/immutable/chunks/n02RSbSe.js","_app/immutable/chunks/C0WzV_g1.js","_app/immutable/chunks/Bm3snW4G.js","_app/immutable/chunks/F6b9OAFo.js","_app/immutable/chunks/DoKfKMj9.js","_app/immutable/chunks/D46IKvaC.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js'))
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
