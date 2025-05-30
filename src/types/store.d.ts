declare module '../../store/cartStore' {
  export interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    image: string
    dimension: {
      width: number
      length: number
      height: number | null
      depth: number | null
      price: number
      additionalOptions: Array<{
        name: string
        available: boolean
        price: number
      }>
    }
    additionalOption: {
      name: string
      available: boolean
      price: number
    } | null
  }

  export interface CartStore {
    items: CartItem[]
    addToCart: (item: CartItem) => void
    removeFromCart: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    totalItems: () => number
    totalPrice: () => number
  }

  export const useCartStore: () => CartStore
}

declare module '../../store/favoritesStore' {
  export interface FavoritesStore {
    favorites: string[]
    toggleFavorite: (id: string) => void
    isFavorite: (id: string) => boolean
    clearFavorites: () => void
  }

  export const useFavoritesStore: () => FavoritesStore
} 