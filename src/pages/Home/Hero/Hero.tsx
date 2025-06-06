import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import styles from './Hero.module.css'

const slides = [
  {
    id: 1,
    title: 'Современная мебель для вашего дома',
    description: 'Создайте уютное пространство с нашей коллекцией мебели премиум-класса',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    buttonText: 'Смотреть каталог',
    buttonLink: '/catalog'
  },
  {
    id: 2,
    title: 'Индивидуальный дизайн',
    description: 'Мы создаем мебель по вашим эскизам с учетом всех пожеланий',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    buttonText: 'Узнать больше',
    buttonLink: '/about'
  },
  {
    id: 3,
    title: 'Бесплатная доставка',
    description: 'При заказе нашей мебели, доставка по всей Беларуси бесплатно',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    buttonText: 'Подробнее',
    buttonLink: '/delivery'
  }
]

export default function Hero() {
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
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className={styles.swiperSlide}>
            <div
              className={styles.slide}
              style={{ backgroundImage: `url(${slide.image})` }}
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
