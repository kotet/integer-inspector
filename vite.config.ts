import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path';
import { ViteMinifyPlugin } from 'vite-plugin-minify'; // minify html

export default defineConfig(
  {
    base: '',
    resolve: {
      alias: {
        src: path.resolve(__dirname, 'src/'),
      }
    },
    build: {
      minify: true,
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, 'index.html')
        },
        output: {
          entryFileNames: '[name]-[hash].js',
        }
      }
    },
    publicDir: 'static/',
    plugins: [
      react({
        include: '**/*.tsx',
      }),
      ViteMinifyPlugin({}),
    ],
    server: {
      open: true,
    }
  }
);
