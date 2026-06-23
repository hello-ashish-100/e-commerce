import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { fetchProductById } from '../../api/products'
import {
  getColorByName,
  getProductMetadata,
  getVariant,
  productColors,
  productSizes,
} from '../../data/productMeta'
import { useGetApi } from '../../hooks/useGetApi'
import { useCart } from '../../stores/useCart'
import { formatMoney } from '../../utils/money'
import styles from './ProductDetailPage.module.scss'

export function ProductDetailPage() {
  const { id } = useParams()
  const { addItem } = useCart()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const {
    data: product,
    error,
    loading,
  } = useGetApi(() => fetchProductById(id ?? ''), [id])

  const selectedColor = getColorByName(searchParams.get('color'))?.name ?? productColors[0].name
  const selectedSize = productSizes.includes(searchParams.get('size') ?? '')
    ? searchParams.get('size')!
    : productSizes[1]

  const metadata = useMemo(() => (product ? getProductMetadata(product) : null), [product])

  const selectedVariant = useMemo(() => {
    if (!product) {
      return undefined
    }

    return getVariant(product.id, selectedColor, selectedSize)
  }, [product, selectedColor, selectedSize])

  const isSoldOut = !selectedVariant || selectedVariant.stockState === 'sold-out'
  const maxQuantity = selectedVariant?.quantityAvailable ?? 0

  useEffect(() => {
    if (!product) {
      return
    }

    const currentColor = searchParams.get('color')
    const currentSize = searchParams.get('size')

    if (currentColor !== selectedColor || currentSize !== selectedSize) {
      setSearchParams({ color: selectedColor, size: selectedSize }, { replace: true })
    }
  }, [product, searchParams, selectedColor, selectedSize, setSearchParams])

  useEffect(() => {
    if (maxQuantity === 0) {
      setQuantity(1)
      return
    }

    setQuantity((currentQuantity) => Math.min(Math.max(currentQuantity, 1), maxQuantity))
  }, [maxQuantity])

  function updateVariant(nextParams: { color?: string; size?: string }) {
    setSearchParams({
      color: nextParams.color ?? selectedColor,
      size: nextParams.size ?? selectedSize,
    })
  }

  function handleQuantityChange(nextQuantity: number) {
    if (maxQuantity === 0) {
      setQuantity(1)
      return
    }

    setQuantity(Math.min(Math.max(nextQuantity, 1), maxQuantity))
  }

  function handleAddToCart() {
    if (!product || !metadata || !selectedVariant || isSoldOut) {
      return
    }

    addItem({
      productId: product.id,
      name: product.title,
      brand: metadata.brand,
      image: metadata.gallery[activeImageIndex]?.src ?? product.image,
      color: selectedVariant.color,
      size: selectedVariant.size,
      unitPrice: metadata.unitPrice,
      originalPrice: metadata.originalPrice,
      maxQuantity: selectedVariant.quantityAvailable,
      stockState: selectedVariant.stockState,
      quantity,
    })
  }

  if (loading) {
    return <p className={styles.message}>Loading product...</p>
  }

  if (error || !product || !metadata) {
    return (
      <section className={styles.message}>
        <p>{error ?? 'Could not load this product.'}</p>
        <Link to="/">Back to products</Link>
      </section>
    )
  }

  return (
    <section className={styles.page}>
      <div className={styles.gallery}>
        <div className={styles.primaryImage}>
          <img
            src={metadata.gallery[activeImageIndex]?.src ?? product.image}
            alt={product.title}
          />
        </div>
        <div className={styles.thumbnails}>
          {metadata.gallery.map((thumbnail, index) => (
            <button
              className={index === activeImageIndex ? styles.activeThumbnail : ''}
              type="button"
              key={thumbnail.label}
              onClick={() => setActiveImageIndex(index)}
              aria-label={`Show ${thumbnail.label.toLowerCase()}`}
            >
              <img src={thumbnail.src} alt="" />
            </button>
          ))}
        </div>
      </div>

      <div className={styles.details}>
        <Link className={styles.backLink} to="/">
          Back to products
        </Link>
        <p className={styles.brand}>{metadata.brand}</p>
        <h1>{product.title}</h1>
        <div className={styles.priceRow}>
          <p className={styles.price}>{formatMoney(metadata.unitPrice)}</p>
          {metadata.originalPrice && (
            <p className={styles.originalPrice}>{formatMoney(metadata.originalPrice)}</p>
          )}
        </div>
        <p className={styles.description}>{product.description}</p>

        <div className={styles.optionGroup}>
          <h2>Color</h2>
          <div className={styles.swatches}>
            {productColors.map((color) => (
              <button
                className={color.name === selectedColor ? styles.selectedSwatch : ''}
                style={{ '--swatch-color': color.hex } as CSSProperties}
                type="button"
                key={color.value}
                onClick={() => updateVariant({ color: color.name })}
                aria-label={`Select ${color.name}`}
              >
                <span aria-hidden="true" />
                {color.name}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.optionGroup}>
          <h2>Size</h2>
          <div className={styles.options}>
            {productSizes.map((size) => {
              const variant = getVariant(product.id, selectedColor, size)
              const buttonClassName = [
                styles.sizeButton,
                size === selectedSize ? styles.selected : '',
                variant?.stockState === 'low-stock' ? styles.lowStock : '',
                variant?.stockState === 'sold-out' ? styles.soldOut : '',
              ]
                .filter(Boolean)
                .join(' ')

              return (
                <button
                  className={buttonClassName}
                  type="button"
                  key={size}
                  onClick={() => updateVariant({ size })}
                >
                  <span>{size}</span>
                  <small>{getStockLabel(variant?.stockState)}</small>
                </button>
              )
            })}
          </div>
        </div>

        <div className={styles.stockNote}>
          {isSoldOut
            ? 'This variant is sold out.'
            : `${maxQuantity} item${maxQuantity === 1 ? '' : 's'} available for this variant.`}
        </div>

        <div className={styles.quantityPicker} aria-label="Quantity picker">
          <button
            type="button"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={isSoldOut || quantity <= 1}
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            type="button"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={isSoldOut || quantity >= maxQuantity}
          >
            +
          </button>
        </div>

        <button
          className={styles.addButton}
          type="button"
          onClick={handleAddToCart}
          disabled={isSoldOut}
        >
          {isSoldOut ? 'Sold out' : 'Add to Cart'}
        </button>
      </div>
    </section>
  )
}

function getStockLabel(stockState?: string) {
  if (stockState === 'sold-out') {
    return 'Sold out'
  }

  if (stockState === 'low-stock') {
    return 'Low stock'
  }

  return 'In stock'
}
