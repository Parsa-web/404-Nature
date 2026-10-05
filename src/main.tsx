import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

import './styles/global.css'
import './styles/layout.css'
import './styles/home.css'
import './styles/archive.css'
import './styles/location.css'
import './styles/data.css'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename || '/'}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
