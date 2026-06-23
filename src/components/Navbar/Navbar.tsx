import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../../stores/useCart'
import styles from './Navbar.module.scss'

export function Navbar() {
  const { itemCount, openCart } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const urlQuery = location.pathname === '/' ? (searchParams.get('q') ?? '') : ''
  const [searchValue, setSearchValue] = useState(urlQuery)

  useEffect(() => {
    setSearchValue(urlQuery)
  }, [urlQuery])

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedQuery = searchValue.trim()

    if (location.pathname === '/') {
      if (trimmedQuery) {
        navigate(`/?q=${encodeURIComponent(trimmedQuery)}`, { replace: true })
      } else {
        navigate('/', { replace: true })
      }
      return
    }

    navigate(trimmedQuery ? `/?q=${encodeURIComponent(trimmedQuery)}` : '/')
  }

  function handleSearchChange(value: string) {
    setSearchValue(value)

    if (location.pathname !== '/') {
      return
    }

    const trimmedQuery = value.trim()

    if (trimmedQuery) {
      navigate(`/?q=${encodeURIComponent(trimmedQuery)}`, { replace: true })
    } else {
      navigate('/', { replace: true })
    }
  }

  return (
    <header className={styles.navbar}>
      <Link className={styles.logo} to="/">
        Nua Shop
      </Link>

      <form className={styles.searchForm} onSubmit={handleSearchSubmit} role="search">
        <label className={styles.searchLabel} htmlFor="product-search">
          Search products
        </label>
        <input
          id="product-search"
          className={styles.searchInput}
          type="search"
          value={searchValue}
          onChange={(event) => handleSearchChange(event.target.value)}
          placeholder="Search products..."
          autoComplete="off"
        />
      </form>

      <button className={styles.cartButton} type="button" onClick={openCart}>
        <span aria-hidden="true">Cart</span>
        <span className={styles.badge}>{itemCount}</span>
      </button>
    </header>
  )
}
