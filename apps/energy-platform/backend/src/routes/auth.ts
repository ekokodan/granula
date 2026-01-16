import { Router } from 'express'
import { asyncHandler } from '@/middleware/errorMiddleware'
import { ApiError } from '@/middleware/errorMiddleware'
import { AuthService } from '@/services/authService'
import { authenticate } from '@/middleware/authMiddleware'
import { prisma } from '@/utils/prisma'

const router = Router()

// POST /api/auth/register - Register new user
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, phone, password, propertyType } = req.body

  // Validation
  if (!name || !email || !password) {
    throw new ApiError('Name, email, and password are required', 400)
  }

  if (password.length < 8) {
    throw new ApiError('Password must be at least 8 characters', 400)
  }

  try {
    const { user, token } = await AuthService.register({
      name,
      email,
      phone,
      password,
      propertyType
    })

    res.status(201).json({
      success: true,
      data: {
        user,
        token
      },
      message: 'User registered successfully. Please verify your email.'
    })
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      throw new ApiError(error.message, 409)
    }
    throw error
  }
}))

// POST /api/auth/login - User login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new ApiError('Email and password are required', 400)
  }

  try {
    const { user, token } = await AuthService.login(email, password)

    res.json({
      success: true,
      data: {
        user,
        token
      },
      message: 'Login successful'
    })
  } catch (error: any) {
    throw new ApiError(error.message, 401)
  }
}))

// POST /api/auth/forgot-password - Request password reset
router.post('/forgot-password', asyncHandler(async (req, res) => {
  const { email } = req.body

  if (!email) {
    throw new ApiError('Email is required', 400)
  }

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email }
  })

  // Don't reveal if user exists or not (security best practice)
  if (user) {
    // TODO: Generate reset token and send email
    // For now, just return success
  }

  res.json({
    success: true,
    message: 'If an account exists with this email, password reset instructions have been sent.'
  })
}))

// POST /api/auth/verify-email - Verify email address
router.post('/verify-email', asyncHandler(async (req, res) => {
  const { token } = req.body

  if (!token) {
    throw new ApiError('Verification token is required', 400)
  }

  // TODO: Implement email verification logic
  // For now, just return success
  res.json({
    success: true,
    message: 'Email verified successfully'
  })
}))

// GET /api/auth/profile - Get user profile (requires authentication)
router.get('/profile', authenticate, asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError('Authentication required', 401)
  }

  const user = await AuthService.getUserById(req.user.userId)

  res.json({
    success: true,
    data: user
  })
}))

export { router as authRouter }