import type { FakeStoreProduct } from '../types/product'
import { fallbackProducts } from '../data/fallbackProducts'

const API_BASE_URL = 'https://fakestoreapi.com'

// Fake Store API has no search endpoint, so product search is handled locally.

export async function fetchProducts(): Promise<FakeStoreProduct[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`)

    if (!response.ok) {
      throw new Error('Unable to load products. Please try again.')
    }

    return response.json()
  } catch {
    return fallbackProducts
  }
}

export async function fetchProductById(id: string): Promise<FakeStoreProduct> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`)

    if (!response.ok) {
      throw new Error('Unable to load this product. Please try again.')
    }

    return response.json()
  } catch {
    const fallbackProduct = fallbackProducts.find((product) => product.id === Number(id))

    if (!fallbackProduct) {
      throw new Error('Unable to load this product. Please try again.')
    }

    return fallbackProduct
  }
}
