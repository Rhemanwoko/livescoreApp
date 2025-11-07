import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyHeaders: Record<string, string> | undefined = env.VITE_FOOTBALL_DATA_TOKEN
    ? {
        'X-Auth-Token': env.VITE_FOOTBALL_DATA_TOKEN,
      }
    : undefined

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'https://api.football-data.org/v4',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          ...(proxyHeaders ? { headers: proxyHeaders } : {}),
        },
      },
    },
  }
})
