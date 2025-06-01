import { useState, useEffect, useRef } from 'react'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, query, orderBy, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import { useNavigate } from 'react-router-dom'
import 'swiper/css'
import 'swiper/css/navigation'
import styles from './ReviewsGroup.module.css'

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBtpxvWXih5ZPRfRMzyGa2PKA0rwc4so48",
    authDomain: "dila-6bad0.firebaseapp.com",
    databaseURL: "https://dila-6bad0-default-rtdb.firebaseio.com",
    projectId: "dila-6bad0",
    storageBucket: "dila-6bad0.appspot.com",
    messagingSenderId: "56204979355",
    appId: "1:56204979355:web:f1b4b0bbcbcb50c8ca6a3e"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const commentsRef = collection(db, 'feedbacks')

interface Review {
    id: string
    username: string
    comment: string
    rating: number
    timestamp: any
}

export default function ReviewsGroup() {
    const [reviews, setReviews] = useState<Review[]>([])
    const swiperRef = useRef<any>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const q = query(commentsRef, orderBy('timestamp', 'desc'))

        const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
            const reviewsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Review[]
            setReviews(reviewsData)
        })

        return () => unsubscribe()
    }, [])

    const renderStars = (rating: number) => {
        return (
            <div className={styles.starRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`${styles.star} ${star <= rating ? styles.selected : ''}`}
                    >
                        ★
                    </span>
                ))}
            </div>
        )
    }

    const handleReadMore = () => {
        navigate('/reviews')
    }

    return (
        <div className={styles.reviewsGroup}>
            <div className={styles.reviewsHeader}>
                <h2 className={styles.reviewsTitle}>Отзывы наших клиентов</h2>
                <div className={styles.navigationButtons}>
                    <button
                        className={styles.navButton}
                        onClick={() => swiperRef.current?.slidePrev()}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button
                        className={styles.navButton}
                        onClick={() => swiperRef.current?.slideNext()}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
            <Swiper
                modules={[Autoplay, Navigation]}
                spaceBetween={20}
                slidesPerView={1}
                loop={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                onBeforeInit={(swiper) => {
                    swiperRef.current = swiper;
                }}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 3,
                    },
                }}
            >
                {reviews.map((review) => (
                    <SwiperSlide key={review.id}>
                        <div className={styles.reviewCard}>
                            <div className={styles.reviewHeader}>
                                <div className={styles.reviewUserInfo}>
                                    <strong className={styles.username}>{review.username}</strong>
                                    {renderStars(review.rating)}
                                </div>
                                <span className={styles.date}>
                                    {review.timestamp?.toDate().toLocaleString('ru-RU') || 'Неизвестно'}
                                </span>
                            </div>
                            <div className={styles.reviewContent}>
                                <p className={styles.comment}>
                                    {review.comment.length > 200
                                        ? `${review.comment.slice(0, 200)}...`
                                        : review.comment}
                                </p>
                                {review.comment.length > 200 && (
                                    <button
                                        className={styles.readMoreButton}
                                        onClick={handleReadMore}
                                    >
                                        Читать полностью
                                    </button>
                                )}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}
