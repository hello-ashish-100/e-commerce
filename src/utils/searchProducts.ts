import { getProductMetadata } from '../data/productMeta'
import type { FakeStoreProduct } from '../types/product'

export function searchProducts(
  products: FakeStoreProduct[],
  query: string,
): FakeStoreProduct[] {
  if (products.length === 0) {
    return products
  }

  const terms = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)

  if (terms.length === 0) {
    return products
  }

  return products.filter((product) => {
    const metadata = getProductMetadata(product)
    const haystack = [
      product.title,
      product.description,
      product.category,
      metadata.brand,
    ]
      .join(' ')
      .toLowerCase()

    return terms.every((term) => haystack.includes(term))
  })
}
