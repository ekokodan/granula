import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Landing } from '@/pages/Landing'
import { Store } from '@/pages/Store'
import { Deals } from '@/pages/Deals'
import { Builder } from '@/pages/Builder'
import { Commercial } from '@/pages/Commercial'
import { About } from '@/pages/About'
import { Checkout } from '@/pages/Checkout'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/store" element={<Store />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/commercial" element={<Commercial />} />
        <Route path="/about" element={<About />} />
        <Route path="/checkout" element={<Checkout />} />
        {/* Add more routes as needed */}
        <Route path="*" element={<Landing />} />
      </Routes>
    </Layout>
  )
}

export default App
