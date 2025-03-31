import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRoutes from './router.tsx'
import 'antd/dist/reset.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRoutes />;
  </StrictMode>,
)
