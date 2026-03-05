import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    },
    build: {
        rollupOptions: {
            output: {
                // Split Monaco Editor into its own chunk — it's ~2MB
                manualChunks: {
                    'monaco-editor': ['@monaco-editor/react'],
                    'vendor': ['react', 'react-dom', 'react-router-dom'],
                    'motion': ['framer-motion'],
                }
            }
        },
        // Increase chunk size warning limit slightly since Monaco is large
        chunkSizeWarningLimit: 1000,
    },
    optimizeDeps: {
        // Pre-bundle these for faster dev-server cold starts
        include: ['react', 'react-dom', 'react-router-dom', 'axios', 'framer-motion'],
    }
})
