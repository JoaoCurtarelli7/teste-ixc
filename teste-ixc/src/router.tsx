import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Transactions from './pages/Transactions'

const AppRoutes = () => {
  return (
    <BrowserRouter key="/">
      <Routes>
        <Route path="/" element={<Transactions />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
