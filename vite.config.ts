import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createHtmlPlugin } from 'vite-plugin-html';
import path from 'path';

export default defineConfig(
  {
    resolve: {
      alias: {
        src: path.resolve(__dirname, 'src'),
      }
    },
    publicDir: 'static/',
    plugins: [
      react({
        include: '**/*.tsx',
      }),
      createHtmlPlugin({
        minify: false,
        entry: 'src/index.tsx',
        template: 'src/index.html',
      }),
    ]
  }
);
