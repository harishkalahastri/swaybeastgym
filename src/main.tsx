import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { GymProvider } from './context/GymContext'
import './index.css'

// Global fetch interceptor to route /api/* to /_/backend/api/* in production Vercel deployment
if (import.meta.env.PROD) {
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    if (typeof input === 'string' && input.startsWith('/api/')) {
      return originalFetch('/_/backend' + input, init);
    }
    return originalFetch(input, init);
  };
}


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GymProvider>
      <App />
    </GymProvider>
  </React.StrictMode>,
)
