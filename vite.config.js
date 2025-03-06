
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: ["c89bb66e-1df0-44f5-be27-b8592e0171a7-00-1dkhjv3cdpacm.sisko.replit.dev", "all"]
  },
  base: '/1/',
})
