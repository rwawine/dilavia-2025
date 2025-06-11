'use client'

import { useState, useEffect } from 'react'
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
  privacy: boolean
  preferredContact: 'phone' | 'telegram' | 'email'
  telegram?: string
}

type FormErrors = Partial<Record<keyof FormData, string>> & {
  submit?: string
}

const TELEGRAM_BOT_TOKEN = '8125343989:AAEoT5kUFJaziP1OIF9cDvuB_mcqY2oKuPQ'
const TELEGRAM_CHAT_ID = '@dilaviatest2233'
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

// Функция для форматирования номера телефона
const formatPhoneNumber = (value: string) => {
  // Удаляем все нецифровые символы
  const numbers = value.replace(/\D/g, '')
  
  // Если номер начинается с 375, добавляем +
  if (numbers.startsWith('375')) {
    return `+${numbers.slice(0, 3)} ${numbers.slice(3, 5)} ${numbers.slice(5, 8)} ${numbers.slice(8, 10)} ${numbers.slice(10, 12)}`
  }
  
  // Если номер начинается с 80, заменяем на +375
  if (numbers.startsWith('80')) {
    return `+375 ${numbers.slice(2, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7, 9)} ${numbers.slice(9, 11)}`
  }
  
  // Если номер начинается с 8, заменяем на +375
  if (numbers.startsWith('8')) {
    return `+375 ${numbers.slice(1, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 8)} ${numbers.slice(8, 10)}`
  }
  
  // Если номер начинается с 9, добавляем +375
  if (numbers.startsWith('9')) {
    return `+375 ${numbers.slice(0, 2)} ${numbers.slice(2, 5)} ${numbers.slice(5, 7)} ${numbers.slice(7, 9)}`
  }
  
  // Для всех остальных случаев
  return `+375 ${numbers.slice(0, 2)} ${numbers.slice(2, 5)} ${numbers.slice(5, 7)} ${numbers.slice(7, 9)}`
}

// Функция для валидации номера телефона
const validatePhoneNumber = (phone: string) => {
  const numbers = phone.replace(/\D/g, '')
  return numbers.length === 12 && numbers.startsWith('375')
}

export default function ModalContactForm({ isOpen, onClose }: ModalContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    privacy: false,
    preferredContact: 'phone'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [success, setSuccess] = useState(false)

  // Сброс формы при закрытии
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        privacy: false,
        preferredContact: 'phone'
      })
      setErrors({})
      setSuccess(false)
    }
  }, [isOpen])

  // Автоматическое закрытие после успешной отправки
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (success) {
      timer = setTimeout(() => {
        onClose()
      }, 10000) // 10 секунд
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [success, onClose])

  const renderContactFields = () => {
    switch (formData.preferredContact) {
      case 'telegram':
        return (
          <div className={styles.inputGroup}>
            <label htmlFor="telegram">Telegram</label>
            <input
              type="text"
              id="telegram"
              name="telegram"
              value={formData.telegram || ''}
              onChange={handleChange}
              className={styles.input}
              placeholder="@username"
            />
            {errors.telegram && <p className={styles.error}>{errors.telegram}</p>}
          </div>
        )
      case 'email':
        return (
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
            {errors.email && <p className={styles.error}>{errors.email}</p>}
          </div>
        )
      case 'phone':
      default:
        return (
          <div className={styles.inputGroup}>
            <label htmlFor="phone">Телефон</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={styles.input}
              placeholder="+375 (__) ___-__-__"
              required
            />
            {errors.phone && <p className={styles.error}>{errors.phone}</p>}
          </div>
        )
    }
  }

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Пожалуйста, введите ваше имя'
    }

    switch (formData.preferredContact) {
      case 'telegram':
        if (!formData.telegram?.trim()) {
          newErrors.telegram = 'Пожалуйста, введите ваш Telegram'
        } else if (!formData.telegram.startsWith('@')) {
          newErrors.telegram = 'Telegram должен начинаться с @'
        }
        break
      case 'email':
        if (!formData.email.trim()) {
          newErrors.email = 'Пожалуйста, введите email'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Пожалуйста, введите корректный email'
        }
        break
      case 'phone':
      default:
        if (!formData.phone.trim()) {
          newErrors.phone = 'Пожалуйста, введите номер телефона'
        } else if (!validatePhoneNumber(formData.phone)) {
          newErrors.phone = 'Пожалуйста, введите корректный номер телефона в формате +375'
        }
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Пожалуйста, введите сообщение'
    }

    if (!formData.privacy) {
      newErrors.privacy = 'Необходимо согласиться с политикой конфиденциальности'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        privacy: checked
      }))
      setErrors(prev => ({ ...prev, privacy: '' }))
      return
    }

    if (name === 'preferredContact') {
      setFormData(prev => ({
        ...prev,
        [name]: value as FormData['preferredContact'],
        // Очищаем неиспользуемые поля при смене способа связи
        email: value === 'email' ? prev.email : '',
        phone: value === 'phone' ? prev.phone : '',
        telegram: value === 'telegram' ? prev.telegram : ''
      }))
      setErrors({})
      return
    }
    
    if (name === 'phone') {
      const formattedPhone = formatPhoneNumber(value)
      setFormData(prev => ({
        ...prev,
        [name]: formattedPhone
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      const contactInfo = formData.preferredContact === 'telegram' 
        ? `📱 *Предпочтительный способ связи:* Telegram (${formData.telegram})\n`
        : formData.preferredContact === 'email'
        ? `📧 *Предпочтительный способ связи:* Email (${formData.email})\n`
        : `📱 *Предпочтительный способ связи:* Телефон (${formData.phone})\n`

      const message = `📨 *Новое сообщение с модального окна*\n\n👤 *Имя:* ${formData.name}\n${contactInfo}${formData.phone ? `📱 *Телефон:* ${formData.phone}\n` : ''}${formData.email ? `📧 *Email:* ${formData.email}\n` : ''}${formData.telegram ? `📱 *Telegram:* ${formData.telegram}\n` : ''}\n💬 *Сообщение:*\n${formData.message}`

      const response = await fetch(TELEGRAM_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      })

      const data = await response.json()

      if (!data.ok) {
        throw new Error(data.description || 'Failed to send message to Telegram')
      }

      setSuccess(true)
    } catch (err) {
      console.error('Error:', err)
      setErrors(prev => ({ ...prev, submit: 'Не удалось отправить сообщение. Пожалуйста, попробуйте позже.' }))
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
            <p className={styles.autoCloseMessage}>Окно закроется автоматически через 10 секунд</p>
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
                />
                {errors.name && <p className={styles.error}>{errors.name}</p>}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="preferredContact">Предпочтительный способ связи</label>
                <select
                  id="preferredContact"
                  name="preferredContact"
                  value={formData.preferredContact}
                  onChange={handleChange}
                  className={styles.input}
                >
                  <option value="phone">Телефон</option>
                  <option value="telegram">Telegram</option>
                  <option value="email">Email</option>
                </select>
              </div>

              {renderContactFields()}

              <div className={styles.inputGroup}>
                <label htmlFor="message">Сообщение</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={styles.textarea}
                  placeholder="Опишите ваш проект или задайте вопрос"
                />
                {errors.message && <p className={styles.error}>{errors.message}</p>}
              </div>

              <div className={styles.privacyGroup}>
                <label className={styles.privacyLabel}>
                  <input
                    type="checkbox"
                    id="privacy"
                    name="privacy"
                    checked={formData.privacy}
                    onChange={handleChange}
                  />
                  <span>
                    Я согласен(а) с{' '}
                    <a 
                      href="/privacy-policy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.privacyLink}
                      onClick={e => e.stopPropagation()}
                    >
                      политикой конфиденциальности
                    </a>
                  </span>
                </label>
                {errors.privacy && <p className={styles.error}>{errors.privacy}</p>}
              </div>

              {errors.submit && <p className={styles.error}>{errors.submit}</p>}

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
