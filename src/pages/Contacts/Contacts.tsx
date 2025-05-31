import { useState } from 'react'
import { SEO } from '../../components/SEO/SEO'
import styles from './Contacts.module.css'

interface FormData {
  name: string
  email: string
  phone: string
  message: string
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  message: ''
}

function Contacts() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Здесь будет логика отправки формы
      await new Promise(resolve => setTimeout(resolve, 1000)) // Имитация запроса
      setSubmitStatus('success')
      setFormData(initialFormData)
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <SEO 
        title="Dilavia - Контакты"
        description="Свяжитесь с нами для получения консультации или оформления заказа"
        keywords="Dilavia, контакты, связь, обратная связь"
      />
      <div className={styles.container}>
        <h1 className={styles.title}>Контакты</h1>

        <div className={styles.content}>
          <div className={styles.contactInfo}>
            <div className={styles.infoCard}>
              <h2 className={styles.infoTitle}>Наши контакты</h2>
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Адрес:</span>
                  <span className={styles.infoValue}>г. Минск, ул. Примерная, 123</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Телефон:</span>
                  <a href="tel:+375291234567" className={styles.infoValue}>+375 (29) 123-45-67</a>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Email:</span>
                  <a href="mailto:info@dilavia.by" className={styles.infoValue}>info@dilavia.by</a>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Режим работы:</span>
                  <span className={styles.infoValue}>Пн-Пт: 9:00 - 18:00</span>
                </div>
              </div>
            </div>

            <div className={styles.mapContainer}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2349.1234567890123!2d27.5678!3d53.9012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTPCsDU0JzA0LjMiTiAyN8KwMzQnMDQuMSJF!5e0!3m2!1sru!2sby!4v1234567890"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Карта расположения офиса"
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <div className={styles.formCard}>
              <h2 className={styles.formTitle}>Напишите нам</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>Ваше имя</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.label}>Телефон</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.label}>Сообщение</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    rows={4}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Отправка...' : 'Отправить'}
                </button>

                {submitStatus === 'success' && (
                  <p className={styles.successMessage}>
                    Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.
                  </p>
                )}

                {submitStatus === 'error' && (
                  <p className={styles.errorMessage}>
                    Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contacts
