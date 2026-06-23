import { createContext } from 'react'
import type { StockState } from '../types/product'

export type CartItem = {
  id: string
  productId: number
  name: string
  brand: string
  image: string
  color: string
  size: string
  unitPrice: number
  originalPrice?: number
  quantity: number
  maxQuantity: number
  stockState: StockState
}

export type AddCartItemInput = Omit<CartItem, 'id' | 'quantity'> & {
  quantity?: number
}

export type AddCartItemOptions = {
  openCart?: boolean
}

export type CartContextValue = {
  isCartOpen: boolean
  items: CartItem[]
  itemCount: number
  subtotal: number
  grandTotal: number
  openCart: () => void
  closeCart: () => void
  addItem: (item: AddCartItemInput, options?: AddCartItemOptions) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
}

export const CartContext = createContext<CartContextValue | undefined>(undefined)
