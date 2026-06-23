import type { FakeStoreProduct, ProductColor, ProductVariant, StockState } from '../types/product'

export const productColors: ProductColor[] = [
  { name: 'Black', value: 'black', hex: '#1f1f1f' },
  { name: 'Ivory', value: 'ivory', hex: '#f4eadb' },
  { name: 'Olive', value: 'olive', hex: '#67704a' },
]

export const productSizes = ['XS', 'S', 'M', 'L', 'XL']

const brands = [
  'Nua Studio',
  'Everyday Form',
  'Aster Lane',
  'Northline',
  'Soft Goods Co.',
  'Urban Loom',
]

export type ProductMetadata = {
  brand: string
  unitPrice: number
  originalPrice?: number
  isOnSale: boolean
  gallery: Array<{
    src: string
    label: string
  }>
  variants: ProductVariant[]
}

export function getProductMetadata(product: FakeStoreProduct): ProductMetadata {
  const isOnSale = product.id % 3 === 0
  const originalPrice = isOnSale ? roundCurrency(product.price * 1.22) : undefined

  return {
    brand: brands[product.id % brands.length],
    unitPrice: product.price,
    originalPrice,
    isOnSale,
    gallery: [
      { src: product.image, label: 'Front view' },
      { src: product.image, label: 'Detail view' },
      { src: product.image, label: 'Styled view' },
    ],
    variants: getProductVariants(product.id),
  }
}

export function getProductVariants(productId: number): ProductVariant[] {
  return productColors.flatMap((color, colorIndex) =>
    productSizes.map((size, sizeIndex) => {
      const stockState = getStockState(productId, colorIndex, sizeIndex)

      return {
        color: color.name,
        size,
        stockState,
        quantityAvailable: getQuantityAvailable(productId, colorIndex, sizeIndex, stockState),
      }
    }),
  )
}

export function getVariant(productId: number, color: string, size: string) {
  return getProductVariants(productId).find(
    (variant) => variant.color === color && variant.size === size,
  )
}

export function getFirstAvailableVariant(productId: number) {
  return getProductVariants(productId).find((variant) => variant.stockState !== 'sold-out')
}

export function getColorByName(colorName: string | null) {
  return productColors.find((color) => color.name === colorName)
}

function getStockState(productId: number, colorIndex: number, sizeIndex: number): StockState {
  const score = (productId + colorIndex * 3 + sizeIndex * 2) % 9

  if (score === 0 || (sizeIndex === productSizes.length - 1 && colorIndex === productId % 3)) {
    return 'sold-out'
  }

  if (score <= 2) {
    return 'low-stock'
  }

  return 'available'
}

function getQuantityAvailable(
  productId: number,
  colorIndex: number,
  sizeIndex: number,
  stockState: StockState,
) {
  if (stockState === 'sold-out') {
    return 0
  }

  if (stockState === 'low-stock') {
    return 1 + ((productId + colorIndex + sizeIndex) % 3)
  }

  return 5 + ((productId + colorIndex + sizeIndex) % 7)
}

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100
}
