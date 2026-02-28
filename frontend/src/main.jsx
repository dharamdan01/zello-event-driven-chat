import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import.meta.env.VITE_SERVER_URL

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <App />
  /* </StrictMode>, */
)
