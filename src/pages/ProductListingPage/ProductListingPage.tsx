import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchProducts } from '../../api/products'
import { getFirstAvailableVariant, getProductMetadata } from '../../data/productMeta'
import { useGetApi } from '../../hooks/useGetApi'
import { buildCartItemId } from '../../stores/CartProvider'
import { useCart } from '../../stores/useCart'
import type { FakeStoreProduct } from '../../types/product'
import { formatMoney } from '../../utils/money'
import { searchProducts } from '../../utils/searchProducts'
import styles from './ProductListingPage.module.scss'

export function ProductListingPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const { data, error, loading } = useGetApi(fetchProducts)
  const products = data ?? []
  const filteredProducts = useMemo(
    () => searchProducts(products, query),
    [products, query],
  )

  return (
    <section>
      <div className={styles.heading}>
        <p>Curated daily essentials</p>
        <h1>{query.trim() ? 'Search Results' : 'Shop Products'}</h1>
        {query.trim() && !loading && !error && (
          <p className={styles.searchSummary}>
            {filteredProducts.length} result{filteredProducts.length === 1 ? '' : 's'} for
            &ldquo;{query.trim()}&rdquo;
          </p>
        )}
      </div>

      {loading && <p className={styles.message}>Loading products...</p>}
      {error && <p className={styles.message}>{error}</p>}

      {!loading && !error && query.trim() && filteredProducts.length === 0 && (
        <p className={styles.message}>No products match your search. Try another term.</p>
      )}

      <div className={styles.grid}>
        {filteredProducts.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: FakeStoreProduct }) {
  const { addItem, items, updateQuantity } = useCart()
  const metadata = getProductMetadata(product)
  const firstAvailableVariant = getFirstAvailableVariant(product.id)

  const cartItemId =
    firstAvailableVariant &&
    buildCartItemId({
      productId: product.id,
      color: firstAvailableVariant.color,
      size: firstAvailableVariant.size,
    })

  const cartItem = cartItemId ? items.find((item) => item.id === cartItemId) : undefined
  const quantity = cartItem?.quantity ?? 0
  const maxQuantity = firstAvailableVariant?.quantityAvailable ?? 0

  function handleQuickAdd() {
    if (!firstAvailableVariant) {
      return
    }

    addItem(
      {
        productId: product.id,
        name: product.title,
        brand: metadata.brand,
        image: product.image,
        color: firstAvailableVariant.color,
        size: firstAvailableVariant.size,
        unitPrice: metadata.unitPrice,
        originalPrice: metadata.originalPrice,
        maxQuantity: firstAvailableVariant.quantityAvailable,
        stockState: firstAvailableVariant.stockState,
        quantity: 1,
      },
      { openCart: false },
    )
  }

  function handleQuantityChange(nextQuantity: number) {
    if (!cartItemId) {
      return
    }

    updateQuantity(cartItemId, nextQuantity)
  }

  return (
    <article className={styles.card}>
      <Link className={styles.imageLink} to={`/product/${product.id}`}>
        <img src={product.image} alt={product.title} />
      </Link>
      <div className={styles.cardBody}>
        <p className={styles.brand}>{metadata.brand}</p>
        <Link className={styles.productName} to={`/product/${product.id}`}>
          {product.title}
        </Link>
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatMoney(metadata.unitPrice)}</span>
          {metadata.originalPrice && (
            <span className={styles.originalPrice}>{formatMoney(metadata.originalPrice)}</span>
          )}
        </div>
        {quantity > 0 ? (
          <div className={styles.quantityPicker} aria-label="Quantity picker">
            <button
              type="button"
              onClick={() => handleQuantityChange(quantity - 1)}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= maxQuantity}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={!firstAvailableVariant}
          >
            Quick add
          </button>
        )}
      </div>
    </article>
  )
}
