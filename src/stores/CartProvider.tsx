import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { CartContext } from './CartContext'
import type { AddCartItemInput, CartContextValue, CartItem } from './CartContext'

const CART_STORAGE_KEY = 'nua-shop-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [items, setItems] = useState<CartItem[]>(readStoredCart)

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((item: AddCartItemInput, options?: { openCart?: boolean }) => {
    const itemId = buildCartItemId(item)
    const quantityToAdd = clampQuantity(item.quantity ?? 1, item.maxQuantity)

    if (quantityToAdd < 1) {
      return
    }

    setItems((currentItems) => {
      const existingItem = currentItems.find((cartItem) => cartItem.id === itemId)

      if (!existingItem) {
        return [
          ...currentItems,
          {
            ...item,
            id: itemId,
            quantity: quantityToAdd,
          },
        ]
      }

      return currentItems.map((cartItem) =>
        cartItem.id === itemId
          ? {
              ...cartItem,
              quantity: clampQuantity(cartItem.quantity + quantityToAdd, cartItem.maxQuantity),
            }
          : cartItem,
      )
    })

    if (options?.openCart !== false) {
      setIsCartOpen(true)
    }
  }, [])

  const removeItem = useCallback((itemId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== itemId))
  }, [])

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity: clampQuantity(quantity, item.maxQuantity),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  )

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.unitPrice * item.quantity, 0),
    [items],
  )

  const value = useMemo<CartContextValue>(
    () => ({
      isCartOpen,
      items,
      itemCount,
      subtotal,
      grandTotal: subtotal,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [addItem, clearCart, isCartOpen, itemCount, items, removeItem, subtotal, updateQuantity],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function buildCartItemId(item: Pick<AddCartItemInput, 'productId' | 'color' | 'size'>) {
  return `${item.productId}-${item.color}-${item.size}`.toLowerCase().replace(/\s+/g, '-')
}

function clampQuantity(quantity: number, maxQuantity: number) {
  return Math.max(0, Math.min(quantity, maxQuantity))
}

function readStoredCart(): CartItem[] {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY)

    if (!storedCart) {
      return []
    }

    const parsedCart: unknown = JSON.parse(storedCart)

    if (!Array.isArray(parsedCart)) {
      return []
    }

    return parsedCart.filter(isCartItem)
  } catch {
    return []
  }
}

function isCartItem(value: unknown): value is CartItem {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    typeof value.productId === 'number' &&
    typeof value.name === 'string' &&
    typeof value.brand === 'string' &&
    typeof value.image === 'string' &&
    typeof value.color === 'string' &&
    typeof value.size === 'string' &&
    typeof value.unitPrice === 'number' &&
    typeof value.quantity === 'number' &&
    typeof value.maxQuantity === 'number' &&
    typeof value.stockState === 'string'
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
