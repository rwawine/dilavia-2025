import React, { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, QuerySnapshot, DocumentData } from 'firebase/firestore'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'
import styles from './Review.module.css'

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

export default function Review() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [username, setUsername] = useState('')
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [errors, setErrors] = useState({
    username: '',
    comment: '',
    rating: ''
  })

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

  const validateForm = () => {
    const newErrors = {
      username: '',
      comment: '',
      rating: ''
    }
    let isValid = true

    if (!username.trim()) {
      newErrors.username = 'Пожалуйста, введите ваше имя'
      isValid = false
    }

    if (!comment.trim()) {
      newErrors.comment = 'Пожалуйста, напишите ваш отзыв'
      isValid = false
    }

    if (rating === 0) {
      newErrors.rating = 'Пожалуйста, выберите оценку'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await addDoc(commentsRef, {
        username: username.trim(),
        comment: comment.trim(),
        rating,
        timestamp: serverTimestamp()
      })

      // Reset form
      setUsername('')
      setComment('')
      setRating(0)
      setErrors({
        username: '',
        comment: '',
        rating: ''
      })
    } catch (error) {
      console.error('Ошибка при добавлении отзыва:', error)
      alert('Ошибка при отправке. Попробуйте ещё раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className={styles.starRating}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${styles.star} ${
              star <= (interactive ? hoveredRating || rating : rating) ? styles.selected : ''
            }`}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className={styles.pageContainer}>
      <Breadcrumbs items={[
        { name: 'Главная', path: '/' },
        { name: 'Отзывы', path: '/reviews' }
      ]} />
      <h1 className={styles.pageTitle}>Отзывы</h1>
      <div className={styles.contentWrapper}>
        <div className={styles.reviewForm}>
          <h2 className={styles.formTitle}>Оставьте отзыв</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setErrors(prev => ({ ...prev, username: '' }))
                }}
                placeholder="Ваше имя"
                className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
              />
              {errors.username && <span className={styles.errorMessage}>{errors.username}</span>}
            </div>
            <div className={styles.inputGroup}>
              <textarea
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value)
                  setErrors(prev => ({ ...prev, comment: '' }))
                }}
                placeholder="Ваш отзыв"
                className={`${styles.textarea} ${errors.comment ? styles.inputError : ''}`}
              />
              {errors.comment && <span className={styles.errorMessage}>{errors.comment}</span>}
            </div>
            <div className={styles.ratingSection}>
              <span className={styles.ratingLabel}>Ваша оценка:</span>
              {renderStars(rating, true)}
              {errors.rating && <span className={styles.errorMessage}>{errors.rating}</span>}
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
            </button>
          </form>
        </div>

        <div className={styles.reviewsSection}>
          <div className={styles.reviewsHeader}>
            <h2 className={styles.reviewsTitle}>Все отзывы</h2>
            <span className={styles.reviewsCount}>
              {reviews.length} {(() => {
                const count = reviews.length;
                const lastDigit = count % 10;
                const lastTwoDigits = count % 100;
                
                if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'отзывов';
                if (lastDigit === 1) return 'отзыв';
                if (lastDigit >= 2 && lastDigit <= 4) return 'отзыва';
                return 'отзывов';
              })()}
            </span>
          </div>
          <div className={styles.reviews}>
            {reviews.map((review) => (
              <div key={review.id} className={styles.review}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewUserInfo}>
                    <strong className={styles.username}>{review.username}</strong>
                    {renderStars(review.rating)}
                  </div>
                  <span className={styles.date}>
                    {review.timestamp?.toDate().toLocaleString('ru-RU') || 'Неизвестно'}
                  </span>
                </div>
                <p className={styles.comment}>{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
