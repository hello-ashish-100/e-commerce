import { CloseIcon } from '../../assets/icons/CloseIcon'
import { useCart } from '../../stores/useCart'
import { formatMoney } from '../../utils/money'
import styles from './CartDrawer.module.scss'

export function CartDrawer() {
  const {
    clearCart,
    closeCart,
    grandTotal,
    isCartOpen,
    items,
    removeItem,
    subtotal,
    updateQuantity,
  } = useCart()

  return (
    <>
      <div
        className={`${styles.backdrop} ${isCartOpen ? styles.backdropOpen : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className={`${styles.drawer} ${isCartOpen ? styles.drawerOpen : ''}`}
        aria-label="Shopping cart"
      >
        <div className={styles.header}>
          <h2>Your cart</h2>
          <button
            className={styles.closeButton}
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
          >
            <CloseIcon />
          </button>
        </div>

        {items.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Your cart is empty.</p>
            <p>Add a product to see it here.</p>
          </div>
        ) : (
          <>
            <div className={styles.itemList}>
              {items.map((item) => (
                <article className={styles.cartItem} key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className={styles.itemInfo}>
                    <p className={styles.brand}>{item.brand}</p>
                    <h3>{item.name}</h3>
                    <p className={styles.variant}>
                      {item.color} / {item.size}
                    </p>
                    <p className={styles.price}>{formatMoney(item.unitPrice)}</p>

                    <div className={styles.itemActions}>
                      <div className={styles.quantityControl}>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.maxQuantity}
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className={styles.removeButton}
                        type="button"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className={styles.summary}>
              <button className={styles.clearButton} type="button" onClick={clearCart}>
                Clear cart
              </button>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <strong>{formatMoney(subtotal)}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Grand total</span>
                <strong>{formatMoney(grandTotal)}</strong>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
