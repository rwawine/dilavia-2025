import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Thumbs } from 'swiper/modules'
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
}

export default function ProductDetail() {
    const { slug } = useParams()
    const [product, setProduct] = useState<Product | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedDimension, setSelectedDimension] = useState<Dimension | null>(null)
    const [selectedOption, setSelectedOption] = useState<AdditionalOption | null>(null)
    const [activeSection, setActiveSection] = useState<string | null>(null)
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null)

    const { addToCart, items } = useCartStore()
    const { toggleFavorite, isFavorite } = useFavoritesStore()

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

    const handleSectionToggle = (section: string) => {
        setActiveSection(activeSection === section ? null : section)
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

  return (
        <>        <Breadcrumbs items={breadcrumbs} />
            <div className={styles.container}>
                <div className={styles.gallery}>
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
                                <img src={`/${image}`} alt={`${product.name} - фото ${index + 1}`} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <Swiper
                        onSwiper={setThumbsSwiper}
                        spaceBetween={10}
                        slidesPerView={4}
                        watchSlidesProgress={true}
                        modules={[Thumbs]}
                        className={styles.thumbsSwiper}
                        breakpoints={{
                            320: {
                                slidesPerView: 3,
                                spaceBetween: 5
                            },
                            480: {
                                slidesPerView: 4,
                                spaceBetween: 10
                            }
                        }}
                    >
                        {product.images.map((image, index) => (
                            <SwiperSlide key={index}>
                                <img src={`/${image}`} alt={`${product.name} - миниатюра ${index + 1}`} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className={styles.info}>
                    <h1 className={styles.title}>{product.name}</h1>
                    <div className={styles.availabilityInfo}>
                        <div className={styles.availabilityItem}>
                            <span className={styles.label}>Доступность:</span>
                            <span className={styles.value}>{product.availability}</span>
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

                    <div className={styles.description}>{product.description}</div>

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

                    <button
                        className={`${styles.addToCartButton} ${isInCart ? styles.inCart : ''}`}
                        onClick={handleAddToCart}
                    >
                        {isInCart ? 'В корзине' : 'В корзину'}
                    </button>

                    <div className={styles.sections}>
                        <div className={styles.section}>
                            <button
                                className={`${styles.sectionButton} ${activeSection === 'characteristics' ? styles.active : ''}`}
                                onClick={() => handleSectionToggle('characteristics')}
                            >
                                Характеристики
                            </button>
                            <div className={`${styles.sectionContent} ${activeSection === 'characteristics' ? styles.active : ''}`}>
                                <div className={styles.characteristic}>
                                    <span>Категория:</span>
                                    <span>{product.category.name}</span>
                                </div>
                                <div className={styles.characteristic}>
                                    <span>Подкатегория:</span>
                                    <span>{product.subcategory.name}</span>
                                </div>
                                <div className={styles.characteristic}>
                                    <span>Стиль:</span>
                                    <span>{product.style}</span>
                                </div>
                                {product.color && (
                                    <div className={styles.characteristic}>
                                        <span>Цвет:</span>
                                        <span>{product.color}</span>
                                    </div>
                                )}
                                <div className={styles.characteristic}>
                                    <span>Страна:</span>
                                    <span>{product.country}</span>
                                </div>
                                <div className={styles.characteristic}>
                                    <span>Гарантия:</span>
                                    <span>{product.warranty}</span>
                                </div>
                                <div className={styles.characteristic}>
                                    <span>Материалы:</span>
                                    <div className={styles.materials}>
                                        {product.materials.map((material, index) => (
                                            <div key={index}>
                                                <strong>{material.name}:</strong> {material.type}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.characteristic}>
                                    <span>Особенности:</span>
                                    <ul className={styles.features}>
                                        {product.features.map((feature, index) => (
                                            <li key={index}>{feature}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <button
                                className={`${styles.sectionButton} ${activeSection === 'delivery' ? styles.active : ''}`}
                                onClick={() => handleSectionToggle('delivery')}
                            >
                                Доставка
                            </button>
                            <div className={`${styles.sectionContent} ${activeSection === 'delivery' ? styles.active : ''}`}>
                                <div className={styles.characteristic}>
                                    <span>Доступность:</span>
                                    <span>{product.delivery.available ? 'Доступна' : 'Недоступна'}</span>
                                </div>
                                <div className={styles.characteristic}>
                                    <span>Стоимость:</span>
                                    <span>{product.delivery.cost}</span>
                                </div>
                                <div className={styles.characteristic}>
                                    <span>Сроки:</span>
                                    <span>{product.delivery.time}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <button
                                className={`${styles.sectionButton} ${activeSection === 'payment' ? styles.active : ''}`}
                                onClick={() => handleSectionToggle('payment')}
                            >
                                Оплата
                            </button>
                            <div className={`${styles.sectionContent} ${activeSection === 'payment' ? styles.active : ''}`}>
                                <h3>Рассрочка и кредит</h3>
                                {product.installmentPlans.map((plan, index) => (
                                    <div key={index} className={styles.paymentPlan}>
                                        <h4>{plan.bank}</h4>
                                        <div className={styles.installment}>
                                            <h5>Рассрочка:</h5>
                                            <ul>
                                                <li>Срок: {plan.installment.durationMonths} месяцев</li>
                                                <li>Процент: {plan.installment.interest}</li>
                                                <li>Дополнительные платежи: {plan.installment.additionalFees}</li>
                                            </ul>
                                        </div>
                                        <div className={styles.credit}>
                                            <h5>Кредит:</h5>
                                            <ul>
                                                <li>Срок: {plan.credit.durationMonths} месяцев</li>
                                                <li>Процент: {plan.credit.interest}</li>
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <PopularProduct />
        </>
  )
}
