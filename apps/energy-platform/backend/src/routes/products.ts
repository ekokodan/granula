import { Router } from 'express'
import { asyncHandler } from '@/middleware/errorMiddleware'
import { prisma } from '@/utils/prisma'
import { ProductCategory, ProductType, Prisma } from '@prisma/client'

const router = Router()

// GET /api/products - Get all products with filtering
router.get('/', asyncHandler(async (req, res) => {
  const { 
    category, 
    type, 
    inStock, 
    minPrice, 
    maxPrice,
    page = '1',
    limit = '20',
    search
  } = req.query

  // Build where clause for filtering
  const where: any = {}

  if (category) {
    where.category = category as ProductCategory
  }

  if (type) {
    where.type = type as ProductType
  }

  if (inStock !== undefined) {
    where.inStock = inStock === 'true'
  }

  if (minPrice || maxPrice) {
    where.price = {}
    if (minPrice) {
      where.price.gte = parseFloat(minPrice as string)
    }
    if (maxPrice) {
      where.price.lte = parseFloat(maxPrice as string)
    }
  }

  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } },
      { manufacturer: { contains: search as string, mode: 'insensitive' } }
    ]
  }

  // Pagination
  const pageNum = parseInt(page as string, 10)
  const limitNum = parseInt(limit as string, 10)
  const skip = (pageNum - 1) * limitNum

  // Fetch products with pagination
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.product.count({ where })
  ])

  res.json({
    success: true,
    data: products,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  })
}))

// GET /api/products/bundles - Get product bundles (must come before /:id)
router.get('/bundles', asyncHandler(async (req, res) => {
  const { type, active } = req.query

  const where: any = {}

  if (type) {
    where.suitableFor = {
      has: type as ProductType
    }
  }

  if (active !== undefined) {
    where.active = active === 'true'
  }

  const bundles = await prisma.bundle.findMany({
    where,
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
              category: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  // Calculate savings for each bundle
  const bundlesWithSavings = bundles.map((bundle) => {
    const itemsTotal = bundle.items.reduce((sum: number, item) => {
      return sum + (item.product.price * item.quantity)
    }, 0)
    
    const savings = itemsTotal - bundle.totalPrice

    return {
      ...bundle,
      itemsTotal,
      savings,
      savingsPercentage: bundle.discountPercent
    }
  })

  res.json({
    success: true,
    data: bundlesWithSavings
  })
}))

// GET /api/products/:id - Get single product
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      reviews: {
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  })

  if (!product) {
    return res.status(404).json({
      success: false,
      error: { message: 'Product not found' }
    })
  }

  // Calculate average rating
  const reviews = await prisma.review.findMany({
    where: { productId: id },
    select: { rating: true }
  })

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum: number, review) => sum + review.rating, 0) / reviews.length
    : 0

  return res.json({
    success: true,
    data: {
      ...product,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: reviews.length
    }
  })
}))

export { router as productsRouter }