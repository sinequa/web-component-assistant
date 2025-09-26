import basicSsl from '@vitejs/plugin-basic-ssl';

const API_URL = 'http://localhost'
const ROOT = '../dist/assistant-element/browser';

export default {
  root: ROOT,
  plugins: [basicSsl()],
  server: {
    open: '/',
    port: 4200,
    host: true,
    https: true,
    proxy: {
      '/api': {
        target: API_URL,
        secure: true,
        changeOrigin: true,
      },
      '/xdownload': {
        target: API_URL,
        secure: true,
        changeOrigin: true,
      },
      '/endpoints': {
        target: API_URL,
        secure: false,
        changeOrigin: true,
        ws: true,
      },
      '/auth/redirect': {
        target: API_URL,
        secure: true,
        changeOrigin: true,
      },
    },
  },
};
