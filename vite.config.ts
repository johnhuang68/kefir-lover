import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Compatibility wrapper to allow process.env.NEXT_PUBLIC_... to work in Vite
      'process.env': env
    },
    build: {
      outDir: 'dist',
    }
  };
});