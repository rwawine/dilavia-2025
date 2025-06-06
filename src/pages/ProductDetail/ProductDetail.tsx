import { useState, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Thumbs } from 'swiper/modules'
import { Helmet } from 'react-helmet-async'
import { useCartStore } from '../../store/cartStore'
import { useFavoritesStore } from '../../store/favoritesStore'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'
import styles from './ProductDetail.module.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import PopularProduct from '../../components/PopularProduct/PopularProduct'


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

interface SeoData {
    title: string
    metaDescription: string
    keywords: string[]
}

interface Product {
    id: string
    name: string
    slug: string
    description: string
    images: string[]
    category: {
        code: string
        name: string
    }
    subcategory: {
        code: string
        name: string
    }
    price: {
        current: number
        old: number | null
        discount: number | null
    }
    dimensions: Dimension[]
    materials: Array<{
        name: string
        type: string
        color: string | null
    }>
    features: string[]
    style: string
    color: string | null
    country: string
    warranty: string
    delivery: {
        available: boolean
        cost: string
        time: string
    }
    installmentPlans: Array<{
        bank: string
        installment: {
            durationMonths: number
            interest: string
            additionalFees: string
        }
        credit: {
            durationMonths: number
            interest: string
        }
    }>
    availability: string
    manufacturing: string
    seo: SeoData
}

export default function ProductDetail() {
    const { slug } = useParams()
    const location = useLocation()
    const [product, setProduct] = useState<Product | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedDimension, setSelectedDimension] = useState<Dimension | null>(null)
    const [selectedOption, setSelectedOption] = useState<AdditionalOption | null>(null)
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const { addToCart, items } = useCartStore()
    const { toggleFavorite, isFavorite } = useFavoritesStore()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [location.pathname])

    useEffect(() => {
        fetchProduct()
    }, [slug])
    
    const fetchProduct = async () => {
        try {
            const response = await fetch('/data/data.json')
            const data = await response.json()
            
            try {
                const foundProduct = data[0].products.find((p: Product) => p.slug === slug)
                
                if (foundProduct) {
                    setProduct(foundProduct)
                    setSelectedDimension(foundProduct.dimensions[0])
                } else {
                    setError('Товар не найден')
                }
            } catch (err) {
                console.error('Error loading product:', err)
                setError('Ошибка при загрузке товара')
            } finally {
                setIsLoading(false)
            }
        } catch (err) {
            console.error('Error fetching product:', err)
            setError('Ошибка при загрузке товара')
            setIsLoading(false)
        }
    }

    const handleAddToCart = () => {
        if (!product || !selectedDimension) return

        addToCart({
            id: product.id,
            name: product.name,
            price: selectedDimension.price + (selectedOption?.price || 0),
            quantity: 1,
            image: product.images[0],
            dimension: selectedDimension,
            additionalOption: selectedOption ? {
                name: selectedOption.name,
                price: selectedOption.price
            } : undefined,
            configuration: {
                material: product.materials[0].name || undefined,
                color: product.color || undefined,
                style: product.style || undefined,
                features: product.features || undefined
            }
        })
    }

    if (isLoading) return <div className={styles.loading}>Загрузка...</div>
    if (error) return <div className={styles.error}>{error}</div>
    if (!product) return null

    const isInCart = items.some(item =>
        item.id === product.id &&
        item.dimension?.width === selectedDimension?.width &&
        item.dimension?.length === selectedDimension?.length &&
        item.additionalOption?.name === selectedOption?.name
    )

    const breadcrumbs = [
        {
            name: product.category.name,
            path: `/catalog/${product.category.code}`
        },
        {
            name: product.subcategory.name,
            path: `/catalog/${product.category.code}/${product.subcategory.code}`
        },
        {
            name: product.name,
            path: `/product/${product.slug}`
        }
    ]

    // Компактные характеристики только по реальным полям
    const shortSpecs: { label: string, value: string | number }[] = [
        { label: 'Артикул', value: product.id },
        { label: 'Модель', value: product.name },
        { label: 'Гарантия', value: product.warranty || '' },
        { label: 'Цвет', value: product.color || '' },
        { label: 'Страна', value: product.country || '' },
        { label: 'Категория', value: product.category?.name || '' },
        { label: 'Подкатегория', value: product.subcategory?.name || '' },
        { label: 'Размер', value: product.dimensions && product.dimensions[0] ? `${product.dimensions[0].width}x${product.dimensions[0].length}` : '' },
        { label: 'Особенности', value: product.features && product.features.length > 0 ? product.features.join(', ') : '' },
    ].filter(spec => spec.value !== '')

    return (
        <>
            <Helmet>
                <title>{product.seo.title}</title>
                <meta name="description" content={product.seo.metaDescription} />
                <meta name="keywords" content={product.seo.keywords.join(', ')} />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="product" />
                <meta property="og:title" content={product.seo.title} />
                <meta property="og:description" content={product.seo.metaDescription} />
                <meta property="og:image" content={`/${product.images[0]}`} />
                
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={product.seo.title} />
                <meta name="twitter:description" content={product.seo.metaDescription} />
                <meta name="twitter:image" content={`/${product.images[0]}`} />
                
                {/* Additional SEO meta tags */}
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={`${window.location.origin}/product/${product.slug}`} />
                
                {/* Product structured data */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Product',
                        name: product.name,
                        description: product.description,
                        image: product.images.map(img => `https://dilavia.by/${img}`),
                        sku: product.id,
                        brand: {
                            '@type': 'Brand',
                            name: 'Dilavia'
                        },
                        offers: {
                            '@type': 'Offer',
                            price: selectedDimension ? selectedDimension.price + (selectedOption?.price || 0) : 0,
                            priceCurrency: 'BYN',
                            availability: product.availability === 'В наличии' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                            url: `${window.location.origin}/product/${product.slug}`
                        }
                    })}
                </script>
            </Helmet>
            <Breadcrumbs items={breadcrumbs} />
            <div className={styles.container}>
                <div className={styles.gallery}>
                    <div className={styles.galleryGrid}>
                        <div className={styles.mainImage}>
                            <Swiper
                                spaceBetween={10}
                                navigation={true}
                                thumbs={{ swiper: thumbsSwiper }}
                                modules={[Navigation, Thumbs]}
                                className={styles.mainSwiper}
                                loop={true}
                            >
                                {product.images.map((image, index) => (
                                    <SwiperSlide key={index}>
                                        <img 
                                            src={`/${image}`} 
                                            alt={`${product.name} - фото ${index + 1}`}
                                            loading="lazy"
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                        <div className={styles.thumbnails}>
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                spaceBetween={8}
                                slidesPerView="auto"
                                watchSlidesProgress={true}
                                modules={[Thumbs]}
                                className={styles.thumbsSwiper}
                                breakpoints={{
                                    320: {
                                        slidesPerView: 3,
                                        spaceBetween: 4
                                    },
                                    480: {
                                        slidesPerView: 4,
                                        spaceBetween: 6
                                    },
                                    768: {
                                        slidesPerView: 4,
                                        spaceBetween: 8
                                    },
                                    1024: {
                                        slidesPerView: 4,
                                        spaceBetween: 10
                                    }
                                }}
                            >
                                {product.images.map((image, index) => (
                                    <SwiperSlide key={index} className={styles.thumbSlide}>
                                        <img 
                                            src={`/${image}`} 
                                            alt={`${product.name} - миниатюра ${index + 1}`}
                                            loading="lazy"
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>

                <div className={styles.info}>
                    <h1 className={styles.title}>{product.name}</h1>
                    <div className={styles.availabilityInfo}>
                        <div className={styles.availabilityItem}>
                            <span className={styles.label}>Доступность:</span>
                            <span className={styles.value}>{product.availability}</span>
                        </div>
                        <div className={styles.categoryLinks}>
                            <span>Категории: </span>
                            <Link to={`/catalog/${product.category.code}/${product.subcategory.code}`} className={styles.categoryLink}>
                                {product.subcategory.name}
                            </Link>
                        </div>
                        <div className={styles.availabilityItem}>
                            <span className={styles.label}>Срок изготовления:</span>
                            <span className={styles.value}>{product.manufacturing}</span>
                        </div>
                    </div>
                    <div className={styles.priceContainer}>
                        <div className={styles.price}>
                            {selectedDimension ? selectedDimension.price + (selectedOption?.price || 0) : 0} BYN
                            {product.price.old && (
                                <span className={styles.oldPrice}>{product.price.old} BYN</span>
                            )}
                        </div>
                        <button
                            className={`${styles.favoriteButton} ${isFavorite(product.id) ? styles.active : ''}`}
                            onClick={() => toggleFavorite(product.id)}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                    fill={isFavorite(product.id) ? '#FF0000' : 'none'}
                                    stroke={isFavorite(product.id) ? '#FF0000' : '#000'}
                                    strokeWidth="2"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className={styles.description}>
                        {product.description}
                    </div>


                    {product.dimensions.length > 1 && (
                        <div className={styles.dimensions}>
                            <label>Размеры:</label>
                            <select
                                value={`${selectedDimension?.width}x${selectedDimension?.length}`}
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

                    {selectedDimension?.additionalOptions && selectedDimension.additionalOptions.length > 0 && (
                        <div className={styles.additionalOptions}>
                            <label>Дополнительные опции:</label>
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
                                            {opt.name} (+{opt.price} BYN)
                                        </option>
                                    ))}
                            </select>
                        </div>
                    )}

                    {/* Компактные характеристики */}
                    <div className={styles.shortSpecsBlock}>
                        {shortSpecs.map((spec, i) => (
                            <div key={i} className={styles.shortSpecRow}>
                                <span className={styles.shortSpecLabel}>{spec.label}</span>
                                <span className={styles.shortSpecValue}>{spec.value}</span>
                            </div>
                        ))}
                        <button className={styles.openDrawerBtn} onClick={() => setIsDrawerOpen(true)}>
                            Характеристики и описание
                        </button>
                    </div>

                    <button
                        className={`${styles.addToCartButton} ${isInCart ? styles.inCart : ''}`}
                        onClick={handleAddToCart}
                    >
                        {isInCart ? 'В корзине' : 'В корзину'}
                    </button>
                </div>
            </div>

            {/* Drawer справа */}
            {isDrawerOpen && (
                <div className={styles.drawerOverlay} onClick={() => setIsDrawerOpen(false)}>
                    <div className={styles.drawer} onClick={e => e.stopPropagation()}>
                        <div className={styles.drawerHeader}>
                            <span className={styles.drawerTitle}>Характеристики и описание</span>
                            <button className={styles.drawerClose} onClick={() => setIsDrawerOpen(false)}>×</button>
                        </div>
                        <div className={styles.drawerContent}>
                            {/* Общие характеристики */}
                            <div className={styles.drawerSection}>
                                <h3>Общие характеристики</h3>
                                <div className={styles.drawerRow}><span>Артикул</span><span>{product.id}</span></div>
                                <div className={styles.drawerRow}><span>Модель</span><span>{product.name}</span></div>
                                {product.warranty && <div className={styles.drawerRow}><span>Гарантия</span><span>{product.warranty}</span></div>}
                                {product.category?.name && <div className={styles.drawerRow}><span>Категория</span><span>{product.category.name}</span></div>}
                                {product.subcategory?.name && <div className={styles.drawerRow}><span>Подкатегория</span><span>{product.subcategory.name}</span></div>}
                                {product.color && <div className={styles.drawerRow}><span>Цвет</span><span>{product.color}</span></div>}
                                {product.country && <div className={styles.drawerRow}><span>Страна</span><span>{product.country}</span></div>}
                            </div>
                            {/* Размеры */}
                            {product.dimensions && product.dimensions.length > 0 && (
                                <div className={styles.drawerSection}>
                                    <h3>Размеры</h3>
                                    {product.dimensions.map((dim, idx) => (
                                        <div key={idx} className={styles.drawerRow}>
                                            <span>{dim.width}x{dim.length}{dim.height ? `x${dim.height}` : ''}{dim.depth ? `x${dim.depth}` : ''} мм</span>
                                            <span>{dim.price} BYN</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {/* Материалы */}
                            {product.materials && product.materials.length > 0 && (
                                <div className={styles.drawerSection}>
                                    <h3>Материалы</h3>
                                    {product.materials.map((mat, idx) => (
                                        <div key={idx} className={styles.drawerRow}>
                                            <span>{mat.name}</span>
                                            <span>{mat.type}{mat.color ? `, ${mat.color}` : ''}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {/* Доставка */}
                            {product.delivery && (
                                <div className={styles.drawerSection}>
                                    <h3>Доставка</h3>
                                    <div className={styles.drawerRow}><span>Доступность</span><span>{product.delivery.available ? 'Доступна' : 'Недоступна'}</span></div>
                                    <div className={styles.drawerRow}><span>Стоимость</span><span>{product.delivery.cost}</span></div>
                                    <div className={styles.drawerRow}><span>Сроки</span><span>{product.delivery.time}</span></div>
                                </div>
                            )}
                            {/* Рассрочка и кредит */}
                            {product.installmentPlans && product.installmentPlans.length > 0 && (
                                <div className={styles.drawerSection}>
                                    <h3>Рассрочка и кредит</h3>
                                    {product.installmentPlans.map((plan, idx) => (
                                        <div key={idx} className={styles.drawerRow}>
                                            <span>{plan.bank}</span>
                                            <span>Рассрочка: {plan.installment.durationMonths} мес, {plan.installment.interest}, {plan.installment.additionalFees} | Кредит: {plan.credit.durationMonths} мес, {plan.credit.interest}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <PopularProduct />
        </>
    )
}
