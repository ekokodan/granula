import { Router } from 'express'
import { asyncHandler } from '@/middleware/errorMiddleware'
import { ApiError } from '@/middleware/errorMiddleware'
import { authenticate, optionalAuth } from '@/middleware/authMiddleware'
import { prisma } from '@/utils/prisma'
import { QuoteStatus } from '@prisma/client'

const router = Router()

// GET /api/quotes - Get all quotes for user (requires auth)
router.get('/', authenticate, asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError('Authentication required', 401)
  }

  const { status, page = '1', limit = '10' } = req.query

  const where: any = {
    userId: req.user.userId
  }

  if (status) {
    where.status = status as QuoteStatus
  }

  const pageNum = parseInt(page as string, 10)
  const limitNum = parseInt(limit as string, 10)
  const skip = (pageNum - 1) * limitNum

  const [quotes, total] = await Promise.all([
    prisma.quote.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                category: true,
                images: true
              }
            }
          }
        }
      }
    }),
    prisma.quote.count({ where })
  ])

  res.json({
    success: true,
    data: quotes,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  })
}))

// POST /api/quotes - Create new quote request
router.post('/', authenticate, asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError('Authentication required', 401)
  }

  const {
    systemConfiguration,
    selectedProducts,
    additionalNotes
  } = req.body

  // Validation
  if (!systemConfiguration || !selectedProducts || selectedProducts.length === 0) {
    throw new ApiError('System configuration and selected products are required', 400)
  }

  // Get products and calculate totals
  const productIds = selectedProducts.map((p: any) => p.productId || p)
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds }
    }
  })

  if (products.length !== productIds.length) {
    throw new ApiError('One or more products not found', 404)
  }

  // Calculate totals
  let subtotal = 0
  const quoteItems = selectedProducts.map((item: any) => {
    const productId = item.productId || item
    const quantity = item.quantity || 1
    const product = products.find(p => p.id === productId)
    
    if (!product) {
      throw new ApiError(`Product ${productId} not found`, 404)
    }

    const unitPrice = product.price
    const total = unitPrice * quantity
    subtotal += total

    return {
      productId,
      quantity,
      unitPrice,
      total
    }
  })

  // Calculate tax (simplified - 8% for now)
  const tax = subtotal * 0.08
  const total = subtotal + tax

  // Create quote
  const quote = await prisma.quote.create({
    data: {
      userId: req.user.userId,
      status: 'PENDING',
      systemConfig: systemConfiguration,
      subtotal,
      tax,
      total,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      notes: additionalNotes,
      items: {
        create: quoteItems
      }
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              category: true,
              price: true,
              images: true
            }
          }
        }
      }
    }
  })

  res.status(201).json({
    success: true,
    data: quote,
    message: 'Quote request submitted successfully. We will contact you within 24 hours.'
  })
}))

// GET /api/quotes/:id - Get quote by ID
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const { id } = req.params

  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              category: true,
              type: true,
              price: true,
              images: true,
              specifications: true
            }
          }
        }
      }
    }
  })

  if (!quote) {
    throw new ApiError('Quote not found', 404)
  }

  // Check if user has permission to view this quote
  if (req.user && req.user.userId !== quote.userId && req.user.role !== 'ADMIN') {
    throw new ApiError('Unauthorized to view this quote', 403)
  }

  res.json({
    success: true,
    data: quote
  })
}))

// PUT /api/quotes/:id/approve - Approve quote (admin)
router.put('/:id/approve', authenticate, asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    throw new ApiError('Admin access required', 403)
  }

  const { id } = req.params
  const { finalPrice, notes } = req.body

  const quote = await prisma.quote.findUnique({
    where: { id }
  })

  if (!quote) {
    throw new ApiError('Quote not found', 404)
  }

  const updatedQuote = await prisma.quote.update({
    where: { id },
    data: {
      status: 'APPROVED',
      total: finalPrice || quote.total,
      internalNotes: notes
    },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  })

  res.json({
    success: true,
    data: updatedQuote,
    message: 'Quote approved successfully'
  })
}))

// GET /api/quotes/:id/download - Download quote as PDF
router.get('/:id/download', optionalAuth, asyncHandler(async (req, res) => {
  const { id } = req.params

  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      user: true,
      items: {
        include: {
          product: true
        }
      }
    }
  })

  if (!quote) {
    throw new ApiError('Quote not found', 404)
  }

  // Check permissions
  if (req.user && req.user.userId !== quote.userId && req.user.role !== 'ADMIN') {
    throw new ApiError('Unauthorized to download this quote', 403)
  }

  // TODO: Generate PDF using PDFKit or jsPDF
  // For now, return quote data
  res.set({
    'Content-Type': 'application/json',
    'Content-Disposition': `attachment; filename="quote-${id}.json"`
  })

  res.json({
    success: true,
    data: quote,
    message: 'PDF generation will be implemented. For now, returning quote data.'
  })
}))

export { router as quotesRouter }