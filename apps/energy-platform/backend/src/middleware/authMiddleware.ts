import { Request, Response, NextFunction } from 'express'
import { AuthService } from '@/services/authService'
import { ApiError } from '@/middleware/errorMiddleware'

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string
        email: string
        role: string
      }
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('No token provided', 401)
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Verify token
    const payload = AuthService.verifyToken(token)

    // Attach user to request
    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    }

    next()
  } catch (error: any) {
    if (error instanceof ApiError) {
      return next(error)
    }
    return next(new ApiError('Invalid or expired token', 401))
  }
}

/**
 * Optional authentication middleware
 * Attaches user if token is present, but doesn't require it
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const payload = AuthService.verifyToken(token)
      req.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role
      }
    }

    next()
  } catch (error) {
    // If token is invalid, just continue without user
    next()
  }
}

/**
 * Role-based authorization middleware
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError('Authentication required', 401))
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError('Insufficient permissions', 403))
    }

    next()
  }
}

