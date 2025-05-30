declare module '*/store/cartStore' {
  export const useCartStore: () => {
    items: any[]
    addToCart: (item: any) => void
    removeFromCart: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    totalItems: () => number
    totalPrice: () => number
  }
}

declare module '*/store/favoritesStore' {
  export const useFavoritesStore: () => {
    favorites: string[]
    toggleFavorite: (id: string) => void
    isFavorite: (id: string) => boolean
    clearFavorites: () => void
  }
} 