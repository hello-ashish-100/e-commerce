import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { ProductDetailPage } from './pages/ProductDetailPage/ProductDetailPage'
import { ProductListingPage } from './pages/ProductListingPage/ProductListingPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<ProductListingPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
