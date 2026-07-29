import { SHOPS } from '../data/shops'
import { useStore } from '../store/StoreContext'

export function ShopSidebar() {
  const { state, setShop } = useStore()

  return (
    <aside className="shop-sidebar" aria-label="Υποκαταστήματα">
      <div className="brand-block">
        <h1>AquaVita</h1>
        <span>Back Office</span>
      </div>
      {SHOPS.map((shop) => (
        <button
          key={shop.id}
          type="button"
          className={`shop-btn${state.selectedShopId === shop.id ? ' active' : ''}`}
          onClick={() => setShop(shop.id)}
          aria-pressed={state.selectedShopId === shop.id}
        >
          {shop.name}
        </button>
      ))}
    </aside>
  )
}
