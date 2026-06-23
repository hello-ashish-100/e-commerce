import { Outlet } from 'react-router-dom'
import { CartDrawer } from '../CartDrawer/CartDrawer'
import { Navbar } from '../Navbar/Navbar'
import styles from './Layout.module.scss'

export function Layout() {
  return (
    <div className={styles.shell}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <CartDrawer />
    </div>
  )
}
