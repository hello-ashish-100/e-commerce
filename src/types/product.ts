export type FakeStoreProduct = {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating?: {
    rate: number
    count: number
  }
}

export type StockState = 'available' | 'low-stock' | 'sold-out'

export type ProductVariant = {
  color: string
  size: string
  stockState: StockState
  quantityAvailable: number
}

export type ProductColor = {
  name: string
  value: string
  hex: string
}
