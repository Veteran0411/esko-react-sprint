import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, '../backend/client'), // ✅ output to backend/client
    emptyOutDir: true, // clears the output dir before building
  },
});
