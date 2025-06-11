import { useEffect, useState } from 'react'
import styles from './SliderBenefits.module.css'

type SlideItemProps = {
    size: 'Large' | 'Medium' | 'Small'
    position?: 'center' | 'bottom' | 'top'
    imageUrl?: string
}

const SlideItem = ({ size, position = 'center', imageUrl }: SlideItemProps) => (
    <div
        className={`${styles.item} ${styles[`item${size}`]}`}
        style={{
            backgroundImage: imageUrl ? `url("${imageUrl}")` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: position,
            borderRadius: '10px'
        }}
    />
)

type TitleItemProps = {
    text: string
}

const TitleItem = ({ text }: TitleItemProps) => (
    <div className={styles.title}>
        <span>{text}</span>
    </div>
)

interface StrapiItem {
    __component: 'shared.title-item' | 'shared.slide-item'
    id: number
    text?: string
    type?: string
    size?: 'Large' | 'Medium' | 'Small'
    position?: 'center' | 'bottom' | 'top' | null
    imageUrl?: {
        url: string
        formats?: {
            [key: string]: { url: string }
        }
    }
}

interface StrapiResponse {
    data: {
        item: StrapiItem[]
    }
}

export default function SliderBenefits() {
    const [items, setItems] = useState<StrapiItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch('https://admin.dilavia.by/api/karusel-s-preimushhestvami?populate[0]=item&populate[1]=item.imageUrl', {
                    headers: {
                        'Authorization': 'Bearer 4d6db2e49ce43ede2750e04d8a12fa96bb9d567de6d40fd1776b834b43ef2871c5a1d0d48347c9416c9d42a66276338aa971d711b828f281508a6e1181c55750e9967fa23d5eb7faac2f6d54cbebe9a841065afd5923b7e6eaee4be2bd0912777c1c8f797506193a7699eefa2a8feb6ab22cf14087bf4cc479865a62052d1f4d'
                    }
                })
                const data: StrapiResponse = await response.json()
                setItems(data.data.item)
            } catch (error) {
                console.error('Error fetching items:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchItems()
    }, [])

    if (loading) {
        return (
            <section className={styles.sliderBenefits}>
                <div className={styles.sliderContainer}>
                    <div className={styles.swiper}>
                        <div className={styles.marquee}>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className={styles.skeletonItem} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className={styles.sliderBenefits}>
            <div className={styles.sliderContainer}>
                <div className={styles.swiper}>
                    <div className={styles.marquee}>
                        {/* Первый набор элементов */}
                        {items.map((item) => (
                            item.__component === 'shared.slide-item'
                                ? <SlideItem
                                    key={`first-${item.id}`}
                                    size={item.size || 'Medium'}
                                    position={item.position || 'center'}
                                    imageUrl={item.imageUrl?.url}
                                />
                                : <TitleItem
                                    key={`first-${item.id}`}
                                    text={item.text || ''}
                                />
                        ))}
                        {/* Второй набор элементов */}
                        {items.map((item) => (
                            item.__component === 'shared.slide-item'
                                ? <SlideItem
                                    key={`second-${item.id}`}
                                    size={item.size || 'Medium'}
                                    position={item.position || 'center'}
                                    imageUrl={item.imageUrl?.url}
                                />
                                : <TitleItem
                                    key={`second-${item.id}`}
                                    text={item.text || ''}
                                />
                        ))}
                        {/* Третий набор элементов для более плавной анимации */}
                        {items.map((item) => (
                            item.__component === 'shared.slide-item'
                                ? <SlideItem
                                    key={`third-${item.id}`}
                                    size={item.size || 'Medium'}
                                    position={item.position || 'center'}
                                    imageUrl={item.imageUrl?.url}
                                />
                                : <TitleItem
                                    key={`third-${item.id}`}
                                    text={item.text || ''}
                                />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
