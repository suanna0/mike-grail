import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		include: ['p5', 'gifenc']
	},
	ssr: {
		noExternal: ['p5', 'gifenc']
	}
});
