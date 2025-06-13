import { useState, useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { useLocation } from 'react-router-dom'
import ProductCard from '../ProductCard/ProductCard'
import styles from './PopularProduct.module.css'
import 'swiper/css'
import 'swiper/css/navigation'

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
  popularity: number
  material: string
  color: string
  style: string
  features: string[]
}

export default function PopularProduct() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const swiperRef = useRef<SwiperType | null>(null)
  const location = useLocation()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/data/data.json')
        const data = await response.json()
        const currentProductSlug = location.pathname.split('/').pop()
        
        const popularProducts = data[0].products
          .filter((product: Product) => product.slug !== currentProductSlug)
          .sort((a: Product, b: Product) => b.popularity - a.popularity)
          .slice(0, 8)
        
        setProducts(popularProducts)
      } catch (err) {
        setError('Ошибка при загрузке товаров')
        console.error('Error fetching products:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [location.pathname])

  if (isLoading) {
    return (
      <section className={styles.skeletonSection}>
        <div className={styles.container}>
          <div className={styles.skeletonHeader}>
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonNavigation}>
              <div className={styles.skeletonNavButton} />
              <div className={styles.skeletonNavButton} />
            </div>
          </div>
          <div className={styles.skeletonGrid}>
            {[...Array(8)].map((_, index) => (
              <div key={index} className={styles.skeletonCard} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Популярные товары</h2>
          <div className={styles.navigation}>
            <button 
              className={styles.navButton}
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Предыдущий слайд"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              className={styles.navButton}
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Следующий слайд"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={24}
          slidesPerView={1}
          loop={true}
          navigation={false}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false
          }}
          breakpoints={{
            640: {
              slidesPerView: 2
            },
            768: {
              slidesPerView: 3
            },
            1024: {
              slidesPerView: 4
            }
          }}
          className={styles.swiper}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className={styles.slide}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
