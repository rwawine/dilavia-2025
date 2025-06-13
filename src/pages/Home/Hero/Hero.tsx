import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import { useEffect, useState, useMemo } from 'react'
import 'swiper/css'
import 'swiper/css/pagination'
import styles from './Hero.module.css'

interface Slide {
  id: number
  title: string
  description: string
  buttonText: string
  buttonLink: string
  image: {
    url: string
    formats?: {
      [key: string]: { url: string }
    }
  }[]
}

// Константы для размеров изображений
const IMAGE_SIZES = {
  desktop: 1920,
  tablet: 1024,
  mobile: 768
}

// Функция для получения оптимального размера изображения
const getOptimalImageSize = () => {
  const width = window.innerWidth
  if (width <= IMAGE_SIZES.mobile) return IMAGE_SIZES.mobile
  if (width <= IMAGE_SIZES.tablet) return IMAGE_SIZES.tablet
  return IMAGE_SIZES.desktop
}

// Функция для оптимизации URL изображения
const optimizeImageUrl = (url: string, width: number) => {
  if (!url) return ''
  return url.replace('/upload/', `/upload/w_${width},c_scale,f_auto,q_auto,dpr_auto,fl_progressive/`)
}

// Функция для предварительной загрузки изображения
const preloadImage = (url: string) => {
  const img = new Image()
  img.src = url
  return new Promise((resolve) => {
    img.onload = resolve
    img.onerror = resolve
  })
}

export default function Hero() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  const [imageSize, setImageSize] = useState(getOptimalImageSize())
  const [firstSlideLoaded, setFirstSlideLoaded] = useState(false)

  // Обработчик изменения размера окна
  useEffect(() => {
    const handleResize = () => {
      setImageSize(getOptimalImageSize())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Загрузка данных
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        // Проверяем кэш
        const cachedData = sessionStorage.getItem('heroSlides')
        const cachedTimestamp = sessionStorage.getItem('heroSlidesTimestamp')
        const now = Date.now()

        // Используем кэш, если он не старше 1 часа
        if (cachedData && cachedTimestamp && (now - parseInt(cachedTimestamp)) < 3600000) {
          const parsedData = JSON.parse(cachedData)
          setSlides(parsedData)

          // Предварительно загружаем первое изображение
          if (parsedData[0]) {
            const firstImage = parsedData[0].image[0]?.formats?.large?.url ||
              parsedData[0].image[0]?.formats?.medium?.url ||
              parsedData[0].image[0]?.url
            if (firstImage) {
              await preloadImage(optimizeImageUrl(firstImage, imageSize))
              setFirstSlideLoaded(true)
            }
          }

          setLoading(false)
          return
        }

        const response = await fetch('https://admin.dilavia.by/api/slajder-na-glavnoj-straniczes?populate=image', {
          headers: {
            'Authorization': 'Bearer 4d6db2e49ce43ede2750e04d8a12fa96bb9d567de6d40fd1776b834b43ef2871c5a1d0d48347c9416c9d42a66276338aa971d711b828f281508a6e1181c55750e9967fa23d5eb7faac2f6d54cbebe9a841065afd5923b7e6eaee4be2bd0912777c1c8f797506193a7699eefa2a8feb6ab22cf14087bf4cc479865a62052d1f4d'
          }
        })
        const data = await response.json()

        // Кэшируем данные с временной меткой
        sessionStorage.setItem('heroSlides', JSON.stringify(data.data))
        sessionStorage.setItem('heroSlidesTimestamp', now.toString())
        setSlides(data.data)

        // Предварительно загружаем первое изображение
        if (data.data[0]) {
          const firstImage = data.data[0].image[0]?.formats?.large?.url ||
            data.data[0].image[0]?.formats?.medium?.url ||
            data.data[0].image[0]?.url
          if (firstImage) {
            await preloadImage(optimizeImageUrl(firstImage, imageSize))
            setFirstSlideLoaded(true)
          }
        }
      } catch (error) {
        console.error('Error fetching slides:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSlides()
  }, [imageSize])

  // Мемоизация оптимизированных слайдов
  const optimizedSlides = useMemo(() => {
    return slides.map(slide => {
      const img = slide.image[0]?.formats?.large?.url ||
        slide.image[0]?.formats?.medium?.url ||
        slide.image[0]?.url ||
        ''

      return {
        ...slide,
        optimizedImage: img ? optimizeImageUrl(img, imageSize) : ''
      }
    })
  }, [slides, imageSize])

  if (loading || !firstSlideLoaded) {
    return (
      <div className={styles.hero}>
        <div className={styles.skeletonHero}>
          <div className={styles.skeletonSlide} />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.hero}>
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        centeredSlides={true}
        autoplay={{
          delay: 10000,
          disableOnInteraction: false
        }}
        pagination={{
          clickable: true,
          el: '.swiper-pagination'
        }}
        className={styles.swiper}
      >
        {optimizedSlides.map((slide) => (
          <SwiperSlide key={slide.id} className={styles.swiperSlide}>
            <div
              className={styles.slide}
              style={slide.optimizedImage ? { backgroundImage: `url(${slide.optimizedImage})` } : undefined}
            >
              <div className={styles.content}>
                <h2 className={styles.title}>{slide.title}</h2>
                <p className={styles.description}>{slide.description}</p>
                <Link to={slide.buttonLink} className={styles.button} title={slide.buttonText}>
                  {slide.buttonText}
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <div className="swiper-pagination"></div>
      </Swiper>
    </div>
  )
}
