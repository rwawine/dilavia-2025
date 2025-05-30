import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AdditionalOption {
  name: string
  available: boolean
  price: number
}

interface Dimension {
  width: number
  length: number
  height: number | null
  depth: number | null
  price: number
  additionalOptions: AdditionalOption[]
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  dimension?: {
    width: number
    length: number
  }
  additionalOption?: {
    name: string
    price: number
  }
  configuration?: {
    material?: string
    color?: string
    style?: string
    features?: string[]
  }
}

interface CartStore {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (item) => {
        const currentItems = get().items
        const existingItem = currentItems.find(
          (i) => i.id === item.id && 
          i.dimension?.width === item.dimension?.width && 
          i.dimension?.length === item.dimension?.length &&
          i.additionalOption?.name === item.additionalOption?.name
        )

        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i === existingItem
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          })
        } else {
          set({ items: [...currentItems, item] })
        }
      },

      removeFromCart: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) })
      },

      updateQuantity: (id, quantity) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })
      },

      clearCart: () => {
        set({ items: [] })
      },

      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      totalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },
    }),
    {
      name: 'cart-storage',
    }
  )
) 