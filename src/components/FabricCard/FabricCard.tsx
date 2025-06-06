import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'
import { useFavoritesStore } from '../../store/favoritesStore'
import styles from './FabricCard.module.css'

interface FabricVariant {
  id: number
  color: {
    code: string
    name: string
  }
  image: string
}

interface FabricProps {
  id: string
  material: string
  materialName: string
  collection: string
  collectionName: string
  variantId: number
  variant?: FabricVariant
  type?: string
  applications?: string[]
}

export default function FabricCard({ material, materialName, collection, collectionName, variantId, variant, type, applications }: FabricProps) {
  const navigate = useNavigate()
  const { toggleFavorite, isFavorite } = useFavoritesStore()
  const { addToCart, items } = useCartStore()
  const [isInCart, setIsInCart] = useState(false)

  const fabricFullId = `${material}-${collection}-${variantId}`
  const displayName = `${collectionName} ${variant?.color.name || ''}`
  
  useEffect(() => {
    const isItemInCart = items.some(item => item.id === fabricFullId)
    setIsInCart(isItemInCart)
  }, [fabricFullId, items])

  const handleAddToCart = () => {
    if (isInCart) {
      navigate('/cart')
      return
    }

    addToCart({
      id: fabricFullId,
      name: displayName,
      price: 0,
      quantity: 1,
      image: variant?.image || '',
      dimension: { width: 0, length: 0 },
      configuration: {
        material: materialName,
        color: variant?.color.name || '',
        style: type || '',
        features: applications || []
      }
    })
  }

  const handleCardClick = () => {
    navigate(`/fabric/${material}/${collection}`)
  }

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img 
          src={`/${variant?.image}`} 
          alt={displayName} 
          className={styles.image} 
          onClick={handleCardClick}
        />
        <button 
          className={`${styles.favoriteButton} ${isFavorite(fabricFullId) ? styles.active : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            toggleFavorite(fabricFullId)
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
              fill={isFavorite(fabricFullId) ? '#FF0000' : 'none'} 
              stroke={isFavorite(fabricFullId) ? '#FF0000' : '#000'} 
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>

      <div className={styles.content} onClick={handleCardClick}>
        <h3 className={styles.title}>{displayName}</h3>
        <div className={styles.subtitle}>{materialName}</div>
        
        {variant?.color.name && (
          <div className={styles.colorInfo}>
            <span className={styles.colorLabel}>Цвет:</span>
            <span className={styles.colorValue}>{variant.color.name}</span>
          </div>
        )}

        <div className={styles.priceContainer}>
          <button 
            className={`${styles.addToCartButton} ${isInCart ? styles.inCart : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              handleAddToCart()
            }}
          >
            {isInCart ? 'В корзине' : 'В корзину'}
          </button>
          <Link 
            to={`/fabric/${material}/${collection}`} 
            className={styles.detailsLink}
            title={`Подробнее о ткани ${displayName}`}
            onClick={(e) => e.stopPropagation()}
          >
            Подробнее о ткани
          </Link>
        </div>
      </div>
    </div>
  )
} 