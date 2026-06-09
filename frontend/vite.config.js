import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const webhookPath = '/webhook/21821179-6560-462f-a678-8daf96d079ae/chat';
  const n8nHost = env.VITE_N8N_HOST || 'http://localhost:5678';

  return {
    plugins: [react()],
    build: {
      outDir: '../public',
      emptyOutDir: true,
    },
    server: {
      proxy: {
        '/api/chat': {
          target: n8nHost,
          changeOrigin: true,
          rewrite: () => webhookPath,
        },
      },
    },
  };
});
