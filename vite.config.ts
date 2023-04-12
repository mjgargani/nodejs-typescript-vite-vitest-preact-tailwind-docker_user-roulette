/// <reference types="vitest" />
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite'
import viteTsconfigPaths from 'vite-tsconfig-paths';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), viteTsconfigPaths(), eslint()],
})