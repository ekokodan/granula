import { Router } from 'express'
import { asyncHandler } from '@/middleware/errorMiddleware'
import { ApiError } from '@/middleware/errorMiddleware'
import { authenticate, authorize } from '@/middleware/authMiddleware'
import { prisma } from '@/utils/prisma'
import { OrderStatus, PaymentStatus, PaymentMethod, OrderItemStatus } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const router = Router()

// GET /api/orders - Get all orders for user
router.get('/', authenticate, asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError('Authentication required', 401)
  }

  const { status, page = '1', limit = '10' } = req.query

  const where: any = {
    userId: req.user.userId
  }

  if (status) {
    where.status = status as OrderStatus
  }

  const pageNum = parseInt(page as string, 10)
  const limitNum = parseInt(limit as string, 10)
  const skip = (pageNum - 1) * limitNum

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
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
    prisma.order.count({ where })
  ])

  res.json({
    success: true,
    data: orders,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  })
}))

// POST /api/orders - Create new order
router.post('/', authenticate, asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError('Authentication required', 401)
  }

  const {
    quoteId,
    paymentMethod,
    shippingAddress,
    billingAddress,
    customerNotes
  } = req.body

  // Validation
  if (!shippingAddress) {
    throw new ApiError('Shipping address is required', 400)
  }

  // If quoteId provided, get quote and use its items
  let quote
  let orderItems: any[] = []
  let subtotal = 0
  let tax = 0
  let total = 0

  if (quoteId) {
    quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
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

    // Verify quote belongs to user
    if (quote.userId !== req.user.userId) {
      throw new ApiError('Unauthorized to use this quote', 403)
    }

    // Check if quote is approved
    if (quote.status !== 'APPROVED') {
      throw new ApiError('Quote must be approved before creating order', 400)
    }

    // Use quote items
    orderItems = quote.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.total
    }))

    subtotal = quote.subtotal
    tax = quote.tax
    total = quote.total
  } else {
    // If no quote, require items in request
    const { items } = req.body
    if (!items || items.length === 0) {
      throw new ApiError('Quote ID or items are required', 400)
    }

    // Get products
    const productIds = items.map((item: any) => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    })

    if (products.length !== productIds.length) {
      throw new ApiError('One or more products not found', 404)
    }

    // Calculate totals
    orderItems = items.map((item: any) => {
      const product = products.find(p => p.id === item.productId)
      if (!product) {
        throw new ApiError(`Product ${item.productId} not found`, 404)
      }

      const quantity = item.quantity || 1
      const unitPrice = product.price
      const total = unitPrice * quantity
      subtotal += total

      return {
        productId: item.productId,
        quantity,
        unitPrice,
        total
      }
    })

    tax = subtotal * 0.08
    total = subtotal + tax
  }

  // Generate order number
  const orderNumber = `ORD-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`

  // Create order
  const order = await prisma.order.create({
    data: {
      userId: req.user.userId,
      quoteId: quoteId || null,
      orderNumber,
      status: 'CONFIRMED',
      paymentStatus: 'PENDING',
      subtotal,
      tax,
      discount: 0,
      total,
      estimatedDelivery: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
      estimatedInstallation: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks
      shippingAddress: shippingAddress as any,
      billingAddress: (billingAddress || shippingAddress) as any,
      customerNotes,
      items: {
        create: orderItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
          status: 'ORDERED'
        }))
      },
      timeline: {
        create: {
          stage: 'order_confirmed',
          status: 'completed',
          date: new Date(),
          description: 'Order confirmed and payment pending'
        }
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
      },
      timeline: {
        orderBy: { date: 'desc' }
      }
    }
  })

  res.status(201).json({
    success: true,
    data: order,
    message: 'Order created successfully'
  })
}))

// GET /api/orders/:id - Get order by ID
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError('Authentication required', 401)
  }

  const { id } = req.params

  if (!id) {
    throw new ApiError('Order ID is required', 400)
  }

  const order = await prisma.order.findUnique({
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
      quote: {
        include: {
          items: {
            include: {
              product: true
            }
          }
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
      },
      timeline: {
        orderBy: { date: 'desc' }
      },
      installation: true,
      payments: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!order) {
    throw new ApiError('Order not found', 404)
  }

  // Check permissions
  if (order.userId !== req.user.userId && req.user.role !== 'ADMIN') {
    throw new ApiError('Unauthorized to view this order', 403)
  }

  res.json({
    success: true,
    data: order
  })
}))

// PUT /api/orders/:id/status - Update order status (admin)
router.put('/:id/status', authenticate, authorize('ADMIN'), asyncHandler(async (req, res) => {
  const { id } = req.params
  const { status, notes } = req.body

  if (!id) {
    throw new ApiError('Order ID is required', 400)
  }

  if (!status) {
    throw new ApiError('Status is required', 400)
  }

  const order = await prisma.order.findUnique({
    where: { id }
  })

  if (!order) {
    throw new ApiError('Order not found', 404)
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: {
      status: status as OrderStatus
    },
    include: {
      items: {
        include: {
          product: true
        }
      },
      timeline: {
        orderBy: { date: 'desc' }
      }
    }
  })

  // Add timeline entry
  await prisma.orderTimeline.create({
    data: {
      orderId: id,
      stage: 'status_update',
      status: status,
      description: notes || `Order status updated to ${status}`,
      date: new Date()
    }
  })

  res.json({
    success: true,
    data: updatedOrder,
    message: 'Order status updated successfully'
  })
}))

// POST /api/orders/:id/schedule-installation - Schedule installation
router.post('/:id/schedule-installation', authenticate, asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError('Authentication required', 401)
  }

  const { id } = req.params
  const { scheduledDate, timeSlot, installerCompany, installerContact, installerPhone, installerEmail, specialRequirements } = req.body

  if (!id) {
    throw new ApiError('Order ID is required', 400)
  }

  const order = await prisma.order.findUnique({
    where: { id }
  })

  if (!order) {
    throw new ApiError('Order not found', 404)
  }

  // Check permissions
  if (order.userId !== req.user.userId && req.user.role !== 'ADMIN') {
    throw new ApiError('Unauthorized to schedule installation for this order', 403)
  }

  // Create or update installation
  const installation = await prisma.installation.upsert({
    where: { orderId: id },
    update: {
      scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
      timeSlot,
      installerCompany,
      installerContact,
      installerPhone,
      installerEmail,
      specialRequirements,
      status: 'SCHEDULED'
    },
    create: {
      orderId: id,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
      timeSlot,
      installerCompany,
      installerContact,
      installerPhone,
      installerEmail,
      specialRequirements,
      status: 'SCHEDULED'
    }
  })

  // Add timeline entry
  await prisma.orderTimeline.create({
    data: {
      orderId: id,
      stage: 'installation_scheduled',
      status: 'scheduled',
      description: `Installation scheduled for ${scheduledDate || 'TBD'}`,
      date: scheduledDate ? new Date(scheduledDate) : null
    }
  })

  res.json({
    success: true,
    data: installation,
    message: 'Installation scheduled successfully'
  })
}))

export { router as ordersRouter }