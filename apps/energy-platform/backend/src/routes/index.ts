import { Router } from 'express'
import { productsRouter } from './products'
import { calculatorRouter } from './calculator'
import { quotesRouter } from './quotes'
import { ordersRouter } from './orders'
import { authRouter } from './auth'

const router = Router()

// Health check for API
router.get('/', (req, res) => {
  res.json({
    message: 'Energy Platform API',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      calculator: '/api/calculator',
      quotes: '/api/quotes',
      orders: '/api/orders'
    }
  })
})

// Route modules
router.use('/auth', authRouter)
router.use('/products', productsRouter)
router.use('/calculator', calculatorRouter)
router.use('/quotes', quotesRouter)
router.use('/orders', ordersRouter)

export { router as apiRouter }