import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: ['@rollerbird/canvaskit-wasm-pdf'],
  },
  assetsInclude: ['**/*.wasm'],
});
