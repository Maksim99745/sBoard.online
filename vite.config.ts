import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    include: ['@rollerbird/canvaskit-wasm-pdf'],
  },
  assetsInclude: ['**/*.wasm'],
});
