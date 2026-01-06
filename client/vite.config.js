import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  server: { // Set the development server port
    host: '0.0.0.0', // Allows access from your local network
    proxy: {
      "/api": {
        target: 'http://localhost:3000/', // Backend server address
        changeOrigin: true,
       
      }
    }
  },
  plugins: [react()],
})
