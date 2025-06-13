import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'
import { useFavoritesStore } from '../../store/favoritesStore'
import styles from './ProductCard.module.css'

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
  dimensions: Dimension[]
  material: string
  color: string
  style: string
  features: string[]
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedDimension, setSelectedDimension] = useState<Dimension | null>(
    product.dimensions && product.dimensions.length > 0 ? product.dimensions[0] : null
  )
  const [selectedOption, setSelectedOption] = useState<AdditionalOption | null>(null)
  const [isInCart, setIsInCart] = useState(false)
  const { toggleFavorite, isFavorite: favoritesStoreIsFavorite } = useFavoritesStore()
  const isFavorite = favoritesStoreIsFavorite(product.id)

  const navigate = useNavigate()
  const { addToCart, items } = useCartStore()

  // Проверяем, есть ли товар в корзине при изменении конфигурации
  useEffect(() => {
    const isProductInCart = items.some(item =>
      item.id === product.id &&
      (!selectedDimension || (
        item.dimension?.width === selectedDimension.width &&
        item.dimension?.length === selectedDimension.length
      )) &&
      item.additionalOption?.name === selectedOption?.name
    )

    setIsInCart(isProductInCart)
  }, [product.id, selectedDimension, selectedOption, items])

  const handleAddToCart = () => {
    if (isInCart) {
      navigate('/cart')
      return
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: selectedDimension ?
        selectedDimension.price + (selectedOption?.price || 0) :
        product.price.current,
      quantity: 1,
      image: product.images[0],
      dimension: selectedDimension || undefined,
      additionalOption: selectedOption || undefined,
      configuration: {
        material: product.material,
        color: product.color,
        style: product.style,
        features: product.features
      }
    })
  }

  const hasMultipleDimensions = product.dimensions && product.dimensions.length > 1
  const hasAdditionalOptions = selectedDimension?.additionalOptions && selectedDimension.additionalOptions.length > 0

  const handleProductClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/product/${product.slug}`, { replace: true });
    window.location.reload();
  };

  // Добавляем эффект для проверки сохраненного URL после перезагрузки
  useEffect(() => {
    const savedUrl = sessionStorage.getItem('productUrl');
    if (savedUrl) {
      sessionStorage.removeItem('productUrl');
      window.location.href = savedUrl;
    }
  }, []);

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={product.images[0].startsWith('/') ? product.images[0] : `/${product.images[0]}`}
          alt={product.name}
          className={styles.image}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          style={{
            backgroundImage: `url(${product.images[0].startsWith('/') ? product.images[0] : `/${product.images[0]}`})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(10px)',
            transform: 'scale(1)',
            objectFit: 'cover',
            transition: 'filter 0.3s ease-out'
          }}
          onLoad={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.filter = 'none';
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/placeholder.png';
            target.style.filter = 'none';
          }}
        />
        <button
          className={`${styles.favoriteButton} ${isFavorite ? styles.active : ''}`}
          onClick={() => toggleFavorite(product.id)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill={isFavorite ? '#FF0000' : 'none'}
              stroke={isFavorite ? '#FF0000' : '#000'}
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>

      <div className={styles.content}>
        <Link
          to={`/product/${product.slug}`}
          className={styles.title}
          title={`Подробнее о товаре ${product.name}`}
          onClick={handleProductClick}
        >
          {product.name}
        </Link>

        {hasMultipleDimensions && selectedDimension && (
          <div className={styles.dimensions}>
            <select
              value={`${selectedDimension.width}x${selectedDimension.length}`}
              onChange={(e) => {
                const [width, length] = e.target.value.split('x').map(Number)
                const dimension = product.dimensions.find(d => d.width === width && d.length === length)
                if (dimension) {
                  setSelectedDimension(dimension)
                  setSelectedOption(null)
                }
              }}
              className={styles.dimensionSelect}
            >
              {product.dimensions.map((dim) => (
                <option key={`${dim.width}x${dim.length}`} value={`${dim.width}x${dim.length}`}>
                  {dim.width}x{dim.length} см
                </option>
              ))}
            </select>
          </div>
        )}

        {hasAdditionalOptions && selectedDimension && (
          <div className={styles.additionalOptions}>
            <select
              value={selectedOption?.name || ''}
              onChange={(e) => {
                const option = selectedDimension.additionalOptions.find(opt => opt.name === e.target.value)
                setSelectedOption(option || null)
              }}
              className={styles.optionSelect}
            >
              <option value="">Выберите опцию</option>
              {selectedDimension.additionalOptions.map((opt) => (
                <option key={opt.name} value={opt.name}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.priceContainer}>
          <div className={styles.price}>
            от {selectedDimension ?
              selectedDimension.price + (selectedOption?.price || 0) :
              product.price.current} BYN
            {product.price.old && (
              <span className={styles.oldPrice}>{product.price.old} BYN</span>
            )}
          </div>
          <button
            className={`${styles.addToCartButton} ${isInCart ? styles.inCart : ''}`}
            onClick={handleAddToCart}
          >
            {isInCart ? 'В корзине' : 'В корзину'}
          </button>
          <Link
            to={`/product/${product.slug}`}
            className={styles.detailsLink}
            title={`Подробнее о товаре ${product.name}`}
            onClick={handleProductClick}
          >
            Подробнее о товаре
          </Link>
        </div>
      </div>
    </div>
  )
}