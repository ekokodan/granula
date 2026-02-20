'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product } from '@/data/mockProducts'

interface CartItem {
    product: Product
    quantity: number
    selectedAddOns: string[]
}

interface CartContextType {
    items: CartItem[]
    addToCart: (product: Product, quantity: number, addOns?: string[]) => void
    removeFromCart: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    clearCart: () => void
    getCartTotal: () => number
    getCartCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const ADD_ON_PRICES: Record<string, number | null> = {
    insurance: 50000,
    maintenance: 75000,
    installation: null // TBD
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isHydrated, setIsHydrated] = useState(false)

    // Load cart from localStorage on mount
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('gridco-cart')
            if (savedCart) {
                setItems(JSON.parse(savedCart))
            }
        } catch (error) {
            console.error('Failed to load cart from localStorage:', error)
        }
        setIsHydrated(true)
    }, [])

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isHydrated) {
            try {
                localStorage.setItem('gridco-cart', JSON.stringify(items))
            } catch (error) {
                console.error('Failed to save cart to localStorage:', error)
            }
        }
    }, [items, isHydrated])

    const addToCart = (product: Product, quantity: number, addOns: string[] = []) => {
        setItems((currentItems) => {
            const existingItemIndex = currentItems.findIndex(
                (item) => 
                    item.product.id === product.id && 
                    JSON.stringify(item.selectedAddOns.sort()) === JSON.stringify(addOns.sort())
            )

            if (existingItemIndex > -1) {
                // Item with same add-ons exists, update quantity
                const updatedItems = [...currentItems]
                updatedItems[existingItemIndex].quantity += quantity
                return updatedItems
            } else {
                // Add new item
                return [...currentItems, { product, quantity, selectedAddOns: addOns }]
            }
        })
    }

    const removeFromCart = (productId: string) => {
        setItems((currentItems) => currentItems.filter((item) => item.product.id !== productId))
    }

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId)
            return
        }

        setItems((currentItems) =>
            currentItems.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
            )
        )
    }

    const clearCart = () => {
        setItems([])
    }

    const getCartTotal = () => {
        return items.reduce((total, item) => {
            let itemTotal = item.product.price * item.quantity
            
            // Add prices for selected add-ons
            item.selectedAddOns.forEach((addOnId) => {
                const addOnPrice = ADD_ON_PRICES[addOnId]
                if (addOnPrice !== null) {
                    itemTotal += addOnPrice * item.quantity
                }
            })
            
            return total + itemTotal
        }, 0)
    }

    const getCartCount = () => {
        return items.reduce((count, item) => count + item.quantity, 0)
    }

    const value: CartContextType = {
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount
    }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
