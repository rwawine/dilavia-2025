import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import { useEffect, useState } from 'react'
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

// Функция для оптимизации URL изображения
const optimizeImageUrl = (url: string, width: number = 1920) => {
  if (!url) return '';
  // Добавляем параметры оптимизации для Cloudinary
  return url.replace('/upload/', `/upload/w_${width},c_scale,f_auto,q_auto/`);
};

// Функция для предварительной загрузки изображения
const preloadImage = (url: string) => {
  const img = new Image();
  img.src = url;
};

export default function Hero() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        // Проверяем кэш
        const cachedData = sessionStorage.getItem('heroSlides');
        if (cachedData) {
          setSlides(JSON.parse(cachedData));
          setLoading(false);
          return;
        }

        const response = await fetch('https://admin.dilavia.by/api/slajder-na-glavnoj-straniczes?populate=image', {
          headers: {
            'Authorization': 'Bearer 4d6db2e49ce43ede2750e04d8a12fa96bb9d567de6d40fd1776b834b43ef2871c5a1d0d48347c9416c9d42a66276338aa971d711b828f281508a6e1181c55750e9967fa23d5eb7faac2f6d54cbebe9a841065afd5923b7e6eaee4be2bd0912777c1c8f797506193a7699eefa2a8feb6ab22cf14087bf4cc479865a62052d1f4d'
          }
        })
        const data = await response.json()
        
        // Кэшируем данные
        sessionStorage.setItem('heroSlides', JSON.stringify(data.data));
        setSlides(data.data);

        // Предварительно загружаем изображения
        data.data.forEach((slide: Slide) => {
          const imgUrl = slide.image[0]?.formats?.large?.url ||
            slide.image[0]?.formats?.medium?.url ||
            slide.image[0]?.url;
          if (imgUrl) {
            preloadImage(optimizeImageUrl(imgUrl));
          }
        });
      } catch (error) {
        console.error('Error fetching slides:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSlides()
  }, [])

  if (loading) {
    return <div className={styles.hero}></div>
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
        {slides.map((slide) => {
          const img =
            slide.image[0]?.formats?.large?.url ||
            slide.image[0]?.formats?.medium?.url ||
            slide.image[0]?.url ||
            ''
          
          // Оптимизируем URL изображения
          const bgUrl = img ? optimizeImageUrl(img) : undefined

          return (
            <SwiperSlide key={slide.id} className={styles.swiperSlide}>
              <div
                className={styles.slide}
                style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : undefined}
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
          )
        })}
        <div className="swiper-pagination"></div>
      </Swiper>
    </div>
  )
}
