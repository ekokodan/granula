import { products } from '@/data/mockProducts'
import ProductDetail from './ProductDetail'

// Required for static export — pre-generate all product routes
export function generateStaticParams() {
    return products.map((product) => ({
        id: product.id,
    }))
}

export default function ProductDetailPage() {
    return <ProductDetail />
}
