import { useState, useEffect } from 'react'
import { SEO } from '../../components/SEO/SEO'
import styles from './Contacts.module.css'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'

interface FormData {
  fullname: string
  email: string
  address: string
  category: string
  message: string
  files: File[]
}

const initialFormData: FormData = {
  fullname: '',
  email: '',
  address: '',
  category: '',
  message: '',
  files: []
}

const TELEGRAM_BOT_TOKEN = '8125343989:AAEoT5kUFJaziP1OIF9cDvuB_mcqY2oKuPQ'
const TELEGRAM_CHAT_ID = '-4894017525'
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`

async function sendTextToTelegram(text: string) {
  await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: 'HTML'
    })
  })
}

async function sendFilesToTelegram(files: File[]) {
  for (const file of files) {
    const formData = new FormData()
    formData.append('chat_id', TELEGRAM_CHAT_ID)
    formData.append('document', file)
    await fetch(`${TELEGRAM_API_URL}/sendDocument`, {
      method: 'POST',
      body: formData
    })
  }
}

function Contacts() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  // Автоматический возврат формы через 5 секунд после успеха
  useEffect(() => {
    if (submitStatus === 'success') {
      const timer = setTimeout(() => {
        setSubmitStatus(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [submitStatus])

  function validateForm(): boolean {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Пожалуйста, введите ФИО'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Пожалуйста, введите email'
    } else if (!/^[^@]+@[^@]+\.[^@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email'
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Пожалуйста, введите адрес'
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Пожалуйста, введите суть обращения'
    }
    // Проверка файлов (например, размер не более 10 МБ и тип)
    formData.files.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        newErrors.files = 'Файл "' + file.name + '" превышает 10 МБ'
      }
      if (!/\.(pdf|jpg|jpeg|png|doc|docx)$/i.test(file.name)) {
        newErrors.files = 'Недопустимый тип файла: ' + file.name
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...Array.from(files)]
      }));
    }
  };

  const handleRemoveFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    if (!validateForm()) {
      setIsSubmitting(false)
      return
    }

    try {
      // Формируем текст сообщения
      const text = `
<b>Новое обращение с сайта</b>
<b>ФИО:</b> ${formData.fullname}
<b>Email:</b> ${formData.email}
<b>Адрес:</b> ${formData.address}
<b>Категория:</b> ${formData.category || '-'}
<b>Сообщение:</b>
${formData.message}
      `.trim()

      // 1. Отправляем текст
      await sendTextToTelegram(text)

      // 2. Отправляем файлы (если есть)
      if (formData.files.length > 0) {
        await sendFilesToTelegram(formData.files)
      }

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
        title="Контакты | DILAVIA - Интернет-магазин мебели"
        description="Свяжитесь с нами для консультации по выбору мебели и тканей. Адрес в Минске, телефон, email. Режим работы: Пн-Пт 9:00-18:00. Бесплатная доставка по Минску."
        keywords="контакты DILAVIA, адрес мебельного магазина, телефон DILAVIA, email DILAVIA, режим работы, консультация по мебели, заказать мебель"
      />
      <div className={styles.container}>
        <Breadcrumbs items={[
          { name: 'Главная', path: '/' },
          { name: 'Контакты', path: '/contacts' },
        ]} />
        <h1 className={styles.title}>Контакты</h1>

        <div className={styles.content}>
          <div className={styles.contactInfo}>
            <div className={styles.infoCard}>
              <h2 className={styles.infoTitle}>Наши контакты</h2>
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Адрес:</span>
                  <span className={styles.infoValue}>г. Минск, ул. Казинца 121Ак46</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Телефон:</span>
                  <a href="tel:+375336641830" className={styles.infoValue}>+375 (33) 664-18-30</a>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Email:</span>
                  <a href="mailto:info@dilavia.by" className={styles.infoValue}>infomiagkhikomfort@gmail.com</a>
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
              {submitStatus === 'success' ? (
                <div className={styles.successMessage}>
                  Спасибо! Ваше обращение отправлено.<br />
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label htmlFor="fullname" className={styles.label}>ФИО</label>
                    <input
                      type="text"
                      id="fullname"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleInputChange}
                      className={styles.input}
                      required
                      placeholder="Фамилия Имя Отчество"
                    />
                    {errors.fullname && <div className={styles.errorMessage}>{errors.fullname}</div>}
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
                      placeholder="example@email.com"
                    />
                    {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="address" className={styles.label}>Адрес проживания</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={styles.input}
                      required
                      placeholder="Город, улица, дом, квартира"
                    />
                    {errors.address && <div className={styles.errorMessage}>{errors.address}</div>}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="category" className={styles.label}>Категория обращения (опционально)</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleSelectChange}
                      className={styles.input}
                    >
                      <option value="">Выберите категорию</option>
                      <option value="complaint">Жалоба</option>
                      <option value="suggestion">Предложение</option>
                      <option value="request">Запрос информации</option>
                      <option value="other">Другое</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="message" className={styles.label}>Суть обращения</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className={styles.textarea}
                      rows={4}
                      required
                      placeholder="Опишите суть обращения"
                    />
                    {errors.message && <div className={styles.errorMessage}>{errors.message}</div>}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Документы (опционально)</label>
                    <div className={styles.fileUploadWrapper}>
                      <input
                        type="file"
                        id="file"
                        name="file"
                        className={styles.fileInput}
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        style={{ display: 'none' }}
                        multiple
                      />
                      <label htmlFor="file" className={styles.fileButton}>
                        Прикрепить файл(ы)
                      </label>
                      {formData.files.length > 0 && (
                        <div className={styles.fileInfo} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                          {formData.files.map((file, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span className={styles.fileName}>{file.name}</span>
                              <button
                                type="button"
                                className={styles.removeFileBtn}
                                onClick={() => handleRemoveFile(idx)}
                                aria-label="Удалить файл"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.files && <div className={styles.errorMessage}>{errors.files}</div>}
                    <span className={styles.fileHint}>PDF, JPG, PNG, DOC, DOCX (до 10 МБ)</span>
                  </div>

                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Отправка...' : 'Отправить'}
                  </button>
                </form>
              )}
              {submitStatus === 'error' && (
                <p className={styles.errorMessage}>
                  Произошла ошибка при отправке. Попробуйте позже.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contacts
