'use client'

import { useState } from 'react'
import styles from './ModalContactForm.module.css'

interface ModalContactFormProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  name: string
  email: string
  phone: string
  message: string
}

export default function ModalContactForm({ isOpen, onClose }: ModalContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      })
    } catch (err) {
      setError('Failed to send message. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          ×
        </button>
        
        {success ? (
          <div className={styles.successMessage}>
            <h2>Спасибо за обращение!</h2>
            <p>Мы свяжемся с вами в ближайшее время.</p>
            <button 
              className={styles.submitButton}
              onClick={onClose}
            >
              Закрыть
            </button>
          </div>
        ) : (
          <>
            <h2 className={styles.title}>Обсудить проект</h2>
            <p className={styles.subtitle}>
              Оставьте свои контакты, и мы свяжемся с вами для обсуждения деталей
            </p>
            
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="name">Ваше имя</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Введите ваше имя"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="example@mail.com"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="phone">Телефон</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="+7 (___) ___-__-__"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="message">Сообщение</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={styles.textarea}
                  placeholder="Опишите ваш проект или задайте вопрос"
                  required
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? 'Отправка...' : 'Отправить'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
