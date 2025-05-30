import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesStore {
  favorites: string[]
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  clearFavorites: () => void
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (id) => {
        const currentFavorites = get().favorites
        if (currentFavorites.includes(id)) {
          set({ favorites: currentFavorites.filter((favoriteId) => favoriteId !== id) })
        } else {
          set({ favorites: [...currentFavorites, id] })
        }
      },

      isFavorite: (id) => {
        return get().favorites.includes(id)
      },

      clearFavorites: () => {
        set({ favorites: [] })
      }
    }),
    {
      name: 'favorites-storage'
    }
  )
) 