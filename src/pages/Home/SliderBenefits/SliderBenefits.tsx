import styles from './SliderBenefits.module.css'

type SlideItemProps = {
    size: 'Large' | 'Medium' | 'Small'
    position?: 'center' | 'bottom' | 'top'
    imageUrl?: string
}

const SlideItem = ({ size, position = 'center', imageUrl = 'https://static.tildacdn.com/tild6134-3630-4431-b837-343362633139/pexels-max-rahubovsk.jpg' }: SlideItemProps) => (
    <div
        className={`${styles.item} ${styles[`item${size}`]}`}
        style={{
            backgroundImage: `url("${imageUrl}")`,
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

type BenefitItem = {
    id: number
    type: 'slide' | 'title'
    size?: 'Large' | 'Medium' | 'Small'
    position?: 'center' | 'bottom' | 'top'
    imageUrl?: string
    text?: string
}

const benefits: BenefitItem[] = [
    {
        id: 1,
        type: 'slide',
        size: 'Large',
        position: 'top',
        imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
    },
    {
        id: 2,
        type: 'slide',
        size: 'Medium',
        position: 'center',
        imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
    },
    {
        id: 3,
        type: 'slide',
        size: 'Small',
        position: 'bottom',
        imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
    },
    {
        id: 4,
        type: 'title',
        text: 'территория качественной мебели'
    },
    {
        id: 5,
        type: 'slide',
        size: 'Large',
        position: 'center',
        imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
    },
    {
        id: 6,
        type: 'slide',
        size: 'Medium',
        position: 'top',
        imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
    },
    {
        id: 7,
        type: 'slide',
        size: 'Small',
        position: 'center',
        imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
    },
    {
        id: 8,
        type: 'title',
        text: 'индивидуальный подход'
    },
    {
        id: 9,
        type: 'slide',
        size: 'Large',
        position: 'bottom',
        imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
    },
    {
        id: 10,
        type: 'slide',
        size: 'Medium',
        position: 'center',
        imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
    },
    {
        id: 11,
        type: 'slide',
        size: 'Small',
        position: 'top',
        imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
    },
    {
        id: 12,
        type: 'title',
        text: 'dilavia.by — ваш стиль, наша забота'
    }
]

export default function SliderBenefits() {
    return (
        <section className={styles.sliderBenefits}>
            <div className={styles.sliderContainer}>
                <div className={styles.swiper}>
                    <div className={styles.marquee}>
                        {/* Первый набор элементов */}
                        {benefits.map((item) => (
                            item.type === 'slide'
                                ? <SlideItem
                                    key={`first-${item.id}`}
                                    size={item.size!}
                                    position={item.position}
                                    imageUrl={item.imageUrl}
                                />
                                : <TitleItem
                                    key={`first-${item.id}`}
                                    text={item.text || ''}
                                />
                        ))}
                        {/* Дублируем элементы для бесконечной прокрутки */}
                        {benefits.map((item) => (
                            item.type === 'slide'
                                ? <SlideItem
                                    key={`second-${item.id}`}
                                    size={item.size!}
                                    position={item.position}
                                    imageUrl={item.imageUrl}
                                />
                                : <TitleItem
                                    key={`second-${item.id}`}
                                    text={item.text || ''}
                                />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
