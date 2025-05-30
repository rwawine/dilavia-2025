import { useState, useEffect } from 'react'
import { useFavoritesStore } from '../../store/favoritesStore'
import ProductCard from '../../components/ProductCard/ProductCard'
import FabricCard from '../../components/FabricCard/FabricCard'
import styles from './Favorite.module.css'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'

interface Product {
  id: string
  name: string
  slug: string
  images: string[]
  price: {
    current: number
    old: number | null
    discount: number | null
  }
  dimensions: Array<{
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
  }>
  material: string
  color: string
  style: string
  features: string[]
}

interface FabricVariant {
  id: number
  color: {
    code: string
    name: string
  }
  image: string
}

interface FabricCollection {
  name: string
  nameLoc: string
  type: string
  technicalSpecifications: {
    fabricType: string
    abrasionResistance: string
    composition: string
    compositionLoc: string
    origin: string
    originLoc: string
    applicationAreas: string[]
  }
  variants: FabricVariant[]
}

interface Material {
  name: string
  nameLoc: string
  collections: FabricCollection[]
}

interface FabricFavorite {
  id: string
  material: string
  materialName: string
  collection: string
  collectionName: string
  variantId: number
  variant: FabricVariant
  type: string
  applications: string[]
}

type ActiveTab = 'all' | 'furniture' | 'fabrics'

export default function Favorite() {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([])
  const [favoriteFabrics, setFavoriteFabrics] = useState<FabricFavorite[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<ActiveTab>('all')
  const { favorites } = useFavoritesStore()

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch('/data/data.json')
        const data = await response.json()
        const allProducts = data[0].products
        const allMaterials = data[0].materials

        // Обычные продукты
        const filteredProducts = allProducts.filter((product: Product) => 
          favorites.includes(product.id)
        )
        setFavoriteProducts(filteredProducts)

        // Ткани - нужно обработать отдельно из-за формата ID
        const fabricFavorites: FabricFavorite[] = []
        
        favorites.forEach(favoriteId => {
          // Проверяем, соответствует ли ID формату "Материал-Коллекция-ВариантID"
          const parts = favoriteId.split('-')
          if (parts.length === 3) {
            const materialName = parts[0]
            const collectionName = parts[1]
            const variantId = parseInt(parts[2])
            
            // Ищем соответствующий материал и коллекцию
            const material = allMaterials.find((m: Material) => m.name === materialName)
            if (material) {
              const collection = material.collections.find(
                (c: FabricCollection) => c.name === collectionName
              )
              if (collection) {
                const variant = collection.variants.find(
                  (v: FabricVariant) => v.id === variantId
                )
                if (variant) {
                  fabricFavorites.push({
                    id: favoriteId,
                    material: material.name,
                    materialName: material.nameLoc,
                    collection: collection.name,
                    collectionName: collection.nameLoc,
                    variantId: variant.id,
                    variant: variant,
                    type: collection.type,
                    applications: collection.technicalSpecifications.applicationAreas
                  })
                }
              }
            }
          }
        })
        
        setFavoriteFabrics(fabricFavorites)
      } catch (err) {
        setError('Ошибка при загрузке избранного')
        console.error('Error fetching favorites:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFavorites()
  }, [favorites])

  const changeTab = (tab: ActiveTab) => {
    setActiveTab(tab)
  }

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>
  }

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  const hasFavorites = favoriteProducts.length > 0 || favoriteFabrics.length > 0

  return (
    <div className={styles.container}>
      <Breadcrumbs items={[
        { name: 'Избранное', path: '/favorite' },
      ]} />
      <h1 className={styles.title}>Избранное</h1>
      
      {!hasFavorites ? (
        <div className={styles.empty}>
          <p>В избранном пока нет товаров</p>
        </div>
      ) : (
        <>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
              onClick={() => changeTab('all')}
            >
              Все ({favoriteProducts.length + favoriteFabrics.length})
            </button>
            {favoriteProducts.length > 0 && (
              <button 
                className={`${styles.tab} ${activeTab === 'furniture' ? styles.active : ''}`}
                onClick={() => changeTab('furniture')}
              >
                Мебель ({favoriteProducts.length})
              </button>
            )}
            {favoriteFabrics.length > 0 && (
              <button 
                className={`${styles.tab} ${activeTab === 'fabrics' ? styles.active : ''}`}
                onClick={() => changeTab('fabrics')}
              >
                Ткани ({favoriteFabrics.length})
              </button>
            )}
          </div>
          
          {activeTab === 'all' && (
            <div className={styles.products}>
              {[...favoriteFabrics, ...favoriteProducts.map(product => ({ 
                type: 'product', 
                product 
              }))].map((item, index) => (
                'product' in item ? (
                  <ProductCard key={`product-${item.product.id}`} product={item.product} />
                ) : (
                  <FabricCard key={`fabric-${item.id}`} {...item} />
                )
              ))}
            </div>
          )}
          
          {activeTab === 'fabrics' && favoriteFabrics.length > 0 && (
            <div className={styles.section}>
              <div className={styles.products}>
                {favoriteFabrics.map((fabric) => (
                  <FabricCard key={fabric.id} {...fabric} />
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'furniture' && favoriteProducts.length > 0 && (
            <div className={styles.section}>
              <div className={styles.products}>
                {favoriteProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
