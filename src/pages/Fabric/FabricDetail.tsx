import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'
import { useFavoritesStore } from '../../store/favoritesStore'
import { useCartStore } from '../../store/cartStore'
import { Heart, ShoppingCart } from 'lucide-react'
import styles from './FabricDetail.module.css'

interface Material {
  name: string
  nameLoc: string
  collections: Array<{
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
    variants: Array<{
      id: number
      color: {
        code: string
        name: string
      }
      image: string
    }>
  }>
}

function FabricDetail() {
  const { materialName, collectionName } = useParams()
  const navigate = useNavigate()
  const [material, setMaterial] = useState<Material | null>(null)
  const [selectedCollection, setSelectedCollection] = useState<Material['collections'][0] | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toggleFavorite, isFavorite } = useFavoritesStore()
  const { addToCart, items } = useCartStore()
  const [isInCart, setIsInCart] = useState(false)
  const [isInFavorites, setIsInFavorites] = useState(false)

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const response = await fetch('/data/data.json')
        const data = await response.json()
        const foundMaterial = data[0].materials.find(
          (m: Material) => m.name === materialName
        )
        
        if (!foundMaterial) {
          throw new Error('Ткань не найдена')
        }

        setMaterial(foundMaterial)
        
        const collection = foundMaterial.collections.find(
          (c: Material['collections'][0]) => c.name === collectionName
        )
        
        if (collection) {
          setSelectedCollection(collection)
        } else {
          throw new Error('Коллекция не найдена')
        }
      } catch (err) {
        setError('Ошибка при загрузке ткани')
        console.error('Error fetching material:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMaterial()
  }, [materialName, collectionName])

  useEffect(() => {
    checkIfInCart()
    checkIfInFavorites()
  }, [material, selectedCollection, selectedVariant, items])

  const checkIfInCart = () => {
    if (material && selectedCollection) {
      const selectedVariantData = selectedCollection.variants[selectedVariant]
      const itemId = `${material.name}-${selectedCollection.name}-${selectedVariantData.id}`
      const isItemInCart = items.some(item => item.id === itemId)
      setIsInCart(isItemInCart)
    }
  }
  
  const checkIfInFavorites = () => {
    if (material && selectedCollection) {
      const selectedVariantData = selectedCollection.variants[selectedVariant]
      const itemId = `${material.name}-${selectedCollection.name}-${selectedVariantData.id}`
      setIsInFavorites(isFavorite(itemId))
    }
  }

  const handleVariantClick = (index: number) => {
    setSelectedVariant(index)
  }
  
  const handleFavoriteClick = () => {
    if (material && selectedCollection) {
      const selectedVariantData = selectedCollection.variants[selectedVariant]
      const itemId = `${material.name}-${selectedCollection.name}-${selectedVariantData.id}`
      toggleFavorite(itemId)
      setIsInFavorites(!isInFavorites)
    }
  }
  
  const handleAddToCart = () => {
    if (material && selectedCollection) {
      const selectedVariantData = selectedCollection.variants[selectedVariant]
      
      // Создаем уникальный ID для каждого цвета ткани
      const itemId = `${material.name}-${selectedCollection.name}-${selectedVariantData.id}`
      
      addToCart({
        id: itemId,
        name: `${selectedCollection.nameLoc} ${selectedVariantData.color.name}`,
        price: 0,
        quantity: 1,
        image: selectedVariantData.image,
        dimension: { width: 0, length: 0 },
        configuration: {
          material: material.nameLoc,
          color: selectedVariantData.color.name,
          style: selectedCollection.type,
          features: selectedCollection.technicalSpecifications.applicationAreas
        }
      })
      
      setIsInCart(true)
    }
  }

  const handleGoToCart = () => {
    navigate('/cart')
  }

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>
  }

  if (error || !material || !selectedCollection) {
    return <div className={styles.error}>{error || 'Ткань не найдена'}</div>
  }

  return (
    <div className={styles.container}>
      <Breadcrumbs items={[
        { name: 'Ткани', path: '/fabric' },
        { name: material.nameLoc, path: `/fabric/${material.name}` },
        { name: selectedCollection.nameLoc, path: `/fabric/${material.name}/${selectedCollection.name}` }
      ]} />
      
      <div className={styles.content}>
        <div className={styles.imageSection}>
          <div className={styles.mainImage}>
            <img 
              src={`/${selectedCollection.variants[selectedVariant]?.image}`} 
              alt={selectedCollection.variants[selectedVariant]?.color.name} 
            />
          </div>
          <div className={styles.thumbnails}>
            {selectedCollection.variants.map((variant, index) => (
              <div 
                key={variant.id} 
                className={`${styles.thumbnail} ${index === selectedVariant ? styles.active : ''}`}
                onClick={() => handleVariantClick(index)}
              >
                <img 
                  src={`/${variant.image}`} 
                  alt={variant.color.name} 
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.detailsSection}>
          <div className={styles.header}>
            <h1 className={styles.title}>{selectedCollection.nameLoc}</h1>
            <p className={styles.subtitle}>{material.nameLoc}</p>
          </div>
          
          <div className={styles.colorInfo}>
            <span className={styles.colorLabel}>Цвет:</span>
            <span className={styles.colorName}>{selectedCollection.variants[selectedVariant]?.color.name}</span>
          </div>
          
          <div className={styles.specifications}>
            <h2 className={styles.sectionTitle}>Характеристики</h2>
            <div className={styles.specsGrid}>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Тип ткани</span>
                <span className={styles.specValue}>{selectedCollection.technicalSpecifications.fabricType}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Износостойкость</span>
                <span className={styles.specValue}>{selectedCollection.technicalSpecifications.abrasionResistance} циклов</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Состав</span>
                <span className={styles.specValue}>{selectedCollection.technicalSpecifications.compositionLoc}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Страна</span>
                <span className={styles.specValue}>{selectedCollection.technicalSpecifications.originLoc}</span>
              </div>
            </div>
          </div>

          <div className={styles.application}>
            <h2 className={styles.sectionTitle}>Применение</h2>
            <ul className={styles.applicationList}>
              {selectedCollection.technicalSpecifications.applicationAreas.map((area, index) => (
                <li key={index} className={styles.applicationItem}>{area}</li>
              ))}
            </ul>
          </div>
          
          <div className={styles.actions}>
            <button 
              className={`${styles.cartButton} ${isInCart ? styles.inCart : ''}`}
              onClick={isInCart ? handleGoToCart : handleAddToCart}
            >
              <ShoppingCart size={20} />
              <span>{isInCart ? 'Перейти в корзину' : 'Добавить в корзину'}</span>
            </button>
            <button 
              className={`${styles.favoriteButton} ${isInFavorites ? styles.active : ''}`}
              onClick={handleFavoriteClick}
            >
              <Heart size={20} />
              <span>{isInFavorites ? 'В избранном' : 'Добавить в избранное'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 

export default FabricDetail 