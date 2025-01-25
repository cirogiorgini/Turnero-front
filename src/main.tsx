import { TurnProvider } from '@/context/TurnContext.tsx'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <TurnProvider>
    <App />
  </TurnProvider>,
)
