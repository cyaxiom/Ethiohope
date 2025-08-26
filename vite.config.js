import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      // '@': path.resolve(__dirname, './src'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@settings': path.resolve(__dirname, './src/settings'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@icons': path.resolve(__dirname, './src/assets/icons'),
      '@images': path.resolve(__dirname, './src/assets/images'),
      '@provider': path.resolve(__dirname, './src/provider'),
      '@ui': path.resolve(__dirname, './src/ui'),
      '@redux': path.resolve(__dirname, './src/store'),
      '@helper': path.resolve(__dirname, './src/helper'),
    },
  },
});
