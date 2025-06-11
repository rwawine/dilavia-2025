import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'
import { SEO } from '../../components/SEO/SEO'
import styles from './Cart.module.css'

interface FormData {
  name: string
  phone: string
  address: string
  contactMethod: 'Телефон' | 'telegram' | 'whatsapp' | 'viber'
  paymentMethod: 'Карта' | 'Наличные'
  promoCode?: string
  telegram?: string
  whatsapp?: string
  viber?: string
}

interface FormErrors {
  name?: string
  phone?: string
  address?: string
  contactMethod?: string
  paymentMethod?: string
  submit?: string
  telegram?: string
  whatsapp?: string
  viber?: string
}

const TELEGRAM_BOT_TOKEN = '8125343989:AAEoT5kUFJaziP1OIF9cDvuB_mcqY2oKuPQ'
const TELEGRAM_CHAT_ID = '@dilaviatest2233'

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore()
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [isCheckout, setIsCheckout] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    address: '',
    contactMethod: 'Телефон',
    paymentMethod: 'Карта'
  })
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return
    updateQuantity(id, quantity)
  }

  const handleRemove = (id: string) => {
    removeFromCart(id)
  }

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPromoError(null)

    if (promoCode.toLowerCase() === 'sale5') {
      setAppliedPromo(promoCode)
      setPromoCode('')
    } else {
      setPromoError('Неверный промокод')
    }
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
  }

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Пожалуйста, введите ваше имя'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Имя должно содержать минимум 2 символа'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Пожалуйста, введите номер телефона'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Пожалуйста, введите адрес доставки'
    } else if (formData.address.length < 10) {
      newErrors.address = 'Адрес должен содержать минимум 10 символов'
    }

    // Валидация дополнительных полей для способов связи
    switch (formData.contactMethod) {
      case 'telegram':
        if (!formData.telegram?.trim()) {
          newErrors.telegram = 'Пожалуйста, введите ваш Telegram'
        } else if (!formData.telegram.startsWith('@')) {
          newErrors.telegram = 'Telegram должен начинаться с @'
        }
        break
      case 'whatsapp':
        if (!formData.whatsapp?.trim()) {
          newErrors.whatsapp = 'Пожалуйста, введите ваш WhatsApp'
        }
        break
      case 'viber':
        if (!formData.viber?.trim()) {
          newErrors.viber = 'Пожалуйста, введите ваш Viber'
        }
        break
    }

    setFormErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === 'contactMethod') {
      setFormData(prev => ({
        ...prev,
        [name]: value as FormData['contactMethod'],
        // Очищаем неиспользуемые поля при смене способа связи
        telegram: value === 'telegram' ? prev.telegram : '',
        whatsapp: value === 'whatsapp' ? prev.whatsapp : '',
        viber: value === 'viber' ? prev.viber : ''
      }))
      setFormErrors({})
      return
    }

    if (name === 'phone') {
      // Ограничиваем ввод только цифрами
      const numbers = value.replace(/\D/g, '')
      setFormData(prev => ({
        ...prev,
        phone: numbers
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }

    // Очищаем ошибку при изменении поля
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormErrors({})

    if (!validateForm()) {
      setIsSubmitting(false)
      return
    }

    try {
      // Формируем информацию о способе связи
      let contactInfo = `Способ связи: ${formData.contactMethod}`
      switch (formData.contactMethod) {
        case 'telegram':
          contactInfo += ` (${formData.telegram})`
          break
        case 'whatsapp':
          contactInfo += ` (${formData.whatsapp})`
          break
        case 'viber':
          contactInfo += ` (${formData.viber})`
          break
      }

      // Формируем сообщение о товарах
      const productsMessage = productItems.map(item =>
        `• ${item.name}
  Количество: ${item.quantity}
  ${item.dimension ? `Размер: ${item.dimension.width}x${item.dimension.length}` : ''}
  ${item.additionalOption ? `Доп. опция: ${item.additionalOption.name}` : ''}
  Цена: ${item.price} BYN
  Итого: ${item.price * item.quantity} BYN`
      ).join('\n')

      // Формируем сообщение о тканях
      const fabricsMessage = fabricItems.length > 0
        ? `\n🧵 Ткани:\n${fabricItems.map(item =>
          `• ${item.name}
  Цвет: ${item.configuration?.color || 'Не указан'}`
        ).join('\n')}`
        : ''

      const message = `🛍 Новый заказ!

👤 Контактная информация:
Имя: ${formData.name}
Телефон: ${formData.phone}
Адрес: ${formData.address}
${contactInfo}
Способ оплаты: ${formData.paymentMethod}
${formData.promoCode ? `Промокод: ${formData.promoCode}` : ''}

📦 Заказанные товары:
${productsMessage}${fabricsMessage}

💰 Итого:
Подытог: ${subtotal} BYN
${discount > 0 ? `Скидка: -${discount} BYN` : ''}
Итоговая сумма: ${totalPrice} BYN`

      if (!message.trim()) {
        throw new Error('Message cannot be empty')
      }

      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      })

      const data = await response.json()

      if (!data.ok) {
        console.error('Telegram API Error:', data)
        if (data.error_code === 400 && data.description.includes('chat not found')) {
          throw new Error('Бот не имеет доступа к группе. Пожалуйста, добавьте бота в группу и предоставьте права на отправку сообщений.')
        }
        throw new Error(data.description || 'Failed to send message to Telegram')
      }

      clearCart()
      setSubmitStatus('success')
    } catch (error) {
      console.error('Error sending order:', error)
      setFormErrors(prev => ({
        ...prev,
        submit: error instanceof Error ? error.message : 'Не удалось отправить заказ. Пожалуйста, попробуйте позже.'
      }))
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Разделяем товары на обычные продукты и ткани
  const fabricItems = items.filter(item => item.id.includes('-') && item.price === 0)
  const productItems = items.filter(item => !item.id.includes('-') || item.price > 0)

  const subtotal = productItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = appliedPromo ? subtotal * 0.05 : 0
  const totalPrice = subtotal - discount

  if (items.length === 0 && !isCheckout) {
    return (
      <>
        <SEO
          title="Корзина | DILAVIA - Интернет-магазин мебели"
          description="Ваша корзина в интернет-магазине DILAVIA. Добавляйте понравившиеся товары, оформляйте заказ с доставкой по всей Беларуси. Бесплатная доставка по Минску."
          keywords="корзина, заказ мебели, оформление заказа, доставка мебели, DILAVIA, Дилавия, Дилавиа, дилавиа, дилавия, купить мебель"
        />
        <div className={styles.container}>
          <Breadcrumbs items={[
            { name: 'Главная', path: '/' },
            { name: 'Корзина', path: '/cart' },
          ]} />
          <h1 className={styles.title}>Корзина</h1>
          <div className={styles.empty}>
            <p>В корзине пока нет товаров</p>
            <Link to="/catalog" className={styles.continueShopping}>
              Перейти в каталог
            </Link>
          </div>
        </div>
      </>
    )
  }

  if (submitStatus === 'success') {
    return (
      <>
        <SEO
          title="Заказ оформлен | DILAVIA - Интернет-магазин мебели"
          description="Спасибо за заказ в интернет-магазине DILAVIA! Мы свяжемся с вами в ближайшее время для подтверждения заказа и уточнения деталей доставки."
          keywords="заказ оформлен, подтверждение заказа, DILAVIA, мебельный магазин, доставка мебели"
        />
        <div className={styles.container}>
          <Breadcrumbs items={[
            { name: 'Главная', path: '/' },
            { name: 'Корзина', path: '/cart' },
          ]} />
          <h1 className={styles.title}>Заказ оформлен</h1>
          <div className={styles.successMessage}>
            <p>Спасибо за заказ! Мы свяжемся с вами в ближайшее время.</p>
            <Link to="/catalog" className={styles.backButton}>
              Вернуться в каталог
            </Link>
          </div>
        </div>
      </>
    )
  }

  if (isCheckout) {
    return (
      <>
        <SEO
          title="Оформление заказа | DILAVIA - Интернет-магазин мебели"
          description="Оформление заказа в интернет-магазине DILAVIA. Выберите удобный способ доставки и оплаты. Бесплатная доставка по Минску. Гарантия 18 месяцев."
          keywords="оформление заказа, доставка мебели, оплата мебели, DILAVIA, купить мебель, заказать мебель"
        />
        <div className={styles.container}>
          <Breadcrumbs items={[
            { name: 'Главная', path: '/' },
            { name: 'Корзина', path: '/cart' },
            { name: 'Оформление заказа', path: '/cart/checkout' },
          ]} />
          <h1 className={styles.title}>Оформление заказа</h1>

          <div className={styles.cartContent}>
            <form onSubmit={handleSubmit} className={styles.checkoutForm}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.formLabel}>ФИО</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className={`${styles.formInput} ${formErrors.name ? styles.inputError : ''}`}
                  placeholder="Введите ваше полное имя"
                />
                {formErrors.name && <div className={styles.errorMessage}>{formErrors.name}</div>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.formLabel}>Номер телефона</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  onKeyDown={(e) => {
                    // Разрешаем: backspace, delete, tab, escape, enter, стрелки
                    if ([8, 9, 13, 27, 37, 38, 39, 40, 46].includes(e.keyCode)) {
                      return
                    }
                    // Разрешаем только цифры
                    if (!/^\d$/.test(e.key)) {
                      e.preventDefault()
                    }
                  }}
                  className={`${styles.formInput} ${formErrors.phone ? styles.inputError : ''}`}
                  placeholder="Введите номер телефона"
                />
                {formErrors.phone && <div className={styles.errorMessage}>{formErrors.phone}</div>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="address" className={styles.formLabel}>Адрес доставки</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  className={`${styles.formInput} ${formErrors.address ? styles.inputError : ''}`}
                  placeholder="Введите полный адрес доставки"
                />
                {formErrors.address && <div className={styles.errorMessage}>{formErrors.address}</div>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Удобный способ связи</label>
                <div className={styles.contactMethods}>
                  <label className={`${styles.contactMethod} ${formData.contactMethod === 'Телефон' ? styles.selected : ''}`}>
                    <input
                      type="radio"
                      name="contactMethod"
                      value="Телефон"
                      checked={formData.contactMethod === 'Телефон'}
                      onChange={handleFormChange}
                    />
                    <span>По телефону</span>
                  </label>
                  <label className={`${styles.contactMethod} ${formData.contactMethod === 'telegram' ? styles.selected : ''}`}>
                    <input
                      type="radio"
                      name="contactMethod"
                      value="telegram"
                      checked={formData.contactMethod === 'telegram'}
                      onChange={handleFormChange}
                    />
                    <span>Telegram</span>
                  </label>
                  <label className={`${styles.contactMethod} ${formData.contactMethod === 'whatsapp' ? styles.selected : ''}`}>
                    <input
                      type="radio"
                      name="contactMethod"
                      value="whatsapp"
                      checked={formData.contactMethod === 'whatsapp'}
                      onChange={handleFormChange}
                    />
                    <span>WhatsApp</span>
                  </label>
                  <label className={`${styles.contactMethod} ${formData.contactMethod === 'viber' ? styles.selected : ''}`}>
                    <input
                      type="radio"
                      name="contactMethod"
                      value="viber"
                      checked={formData.contactMethod === 'viber'}
                      onChange={handleFormChange}
                    />
                    <span>Viber</span>
                  </label>
                </div>
              </div>

              {formData.contactMethod === 'telegram' && (
                <div className={styles.formGroup}>
                  <label htmlFor="telegram" className={styles.formLabel}>Telegram</label>
                  <input
                    type="text"
                    id="telegram"
                    name="telegram"
                    value={formData.telegram || ''}
                    onChange={handleFormChange}
                    className={`${styles.formInput} ${formErrors.telegram ? styles.inputError : ''}`}
                    placeholder="@username"
                  />
                  {formErrors.telegram && <div className={styles.errorMessage}>{formErrors.telegram}</div>}
                </div>
              )}

              {formData.contactMethod === 'whatsapp' && (
                <div className={styles.formGroup}>
                  <label htmlFor="whatsapp" className={styles.formLabel}>WhatsApp</label>
                  <input
                    type="text"
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp || ''}
                    onChange={handleFormChange}
                    className={`${styles.formInput} ${formErrors.whatsapp ? styles.inputError : ''}`}
                    placeholder="Введите ваш WhatsApp"
                  />
                  {formErrors.whatsapp && <div className={styles.errorMessage}>{formErrors.whatsapp}</div>}
                </div>
              )}

              {formData.contactMethod === 'viber' && (
                <div className={styles.formGroup}>
                  <label htmlFor="viber" className={styles.formLabel}>Viber</label>
                  <input
                    type="text"
                    id="viber"
                    name="viber"
                    value={formData.viber || ''}
                    onChange={handleFormChange}
                    className={`${styles.formInput} ${formErrors.viber ? styles.inputError : ''}`}
                    placeholder="Введите ваш Viber"
                  />
                  {formErrors.viber && <div className={styles.errorMessage}>{formErrors.viber}</div>}
                </div>
              )}

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Способ оплаты</label>
                <div className={styles.paymentMethods}>
                  <label className={`${styles.paymentMethod} ${formData.paymentMethod === 'Карта' ? styles.selected : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Карта"
                      checked={formData.paymentMethod === 'Карта'}
                      onChange={handleFormChange}
                    />
                    <span>Банковской картой</span>
                  </label>
                  <label className={`${styles.paymentMethod} ${formData.paymentMethod === 'Наличные' ? styles.selected : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Наличные"
                      checked={formData.paymentMethod === 'Наличные'}
                      onChange={handleFormChange}
                    />
                    <span>Наличными при получении</span>
                  </label>
                </div>
              </div>

              {formErrors.submit && (
                <div className={styles.errorMessage}>
                  {formErrors.submit}
                </div>
              )}

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Отправка...' : 'Отправить заказ'}
              </button>
            </form>

            <div className={styles.summary}>
              <h2>Ваш заказ</h2>
              {productItems.length > 0 && (
                <>
                  <h3 className={styles.summaryCategory}>Мебель</h3>
                  {productItems.map((item) => (
                    <div key={item.id} className={styles.summaryItem}>
                      <div className={styles.summaryItemInfo}>
                        <span className={styles.summaryItemName}>{item.name} × {item.quantity}</span>
                        {item.dimension && (
                          <span className={styles.summaryItemDetail}>Размер: {item.dimension.width}x{item.dimension.length} см</span>
                        )}
                        {item.additionalOption && (
                          <span className={styles.summaryItemDetail}>Механизм: {item.additionalOption.name}</span>
                        )}
                      </div>
                      <span className={styles.summaryItemPrice}>{item.price * item.quantity} BYN</span>
                    </div>
                  ))}
                </>
              )}

              {fabricItems.length > 0 && (
                <>
                  <h3 className={styles.summaryCategory}>Ткани</h3>
                  {fabricItems.map((item) => (
                    <div key={item.id} className={styles.summaryItem}>
                      <div className={styles.summaryItemInfo}>
                        <Link to={`/fabric/${item.id.split('-')[0]}/${item.id.split('-')[1]}`} className={styles.summaryItemName}>{item.name}</Link>
                        {item.configuration?.color && (
                          <span className={styles.summaryItemDetail}>Цвет: {item.configuration.color}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {discount > 0 && (
                <div className={styles.summaryRow}>
                  <span>Скидка:</span>
                  <span className={styles.discount}>-{discount} BYN</span>
                </div>
              )}
              <div className={styles.summaryRow}>
                <span>Итого:</span>
                <span className={styles.totalPrice}>{totalPrice} BYN</span>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO
        title="Корзина | DILAVIA - Интернет-магазин мебели"
        description="Ваша корзина в интернет-магазине DILAVIA. Добавляйте понравившиеся товары, оформляйте заказ с доставкой по всей Беларуси. Бесплатная доставка по Минску."
        keywords="корзина, заказ мебели, оформление заказа, доставка мебели, DILAVIA, купить мебель"
      />
      <div className={styles.container}>
        <Breadcrumbs items={[
          { name: 'Главная', path: '/' },
          { name: 'Корзина', path: '/cart' },
        ]} />
        <h1 className={styles.title}>Корзина</h1>

        <div className={styles.cartContent}>
          <div className={styles.items}>
            {/* Отображение тканей */}
            {fabricItems.length > 0 && (
              <>
                <h2 className={styles.categoryTitle}>Ткани</h2>
                <div className={styles.fabricItems}>
                  {fabricItems.map((item) => (
                    <div key={item.id} className={styles.fabricItem}>
                      <div className={styles.fabricImage}>
                        <img src={`/${item.image}`} alt={item.name} />
                      </div>

                      <div className={styles.fabricInfo}>
                        <Link to={`/fabric/${item.id.split('-')[0]}/${item.id.split('-')[1]}`} className={styles.fabricName}>{item.name}</Link>
                        {item.configuration?.color && (
                          <span className={styles.fabricColor}>Цвет: {item.configuration.color}</span>
                        )}
                      </div>

                      <button
                        className={styles.removeButton}
                        onClick={() => handleRemove(item.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Отображение обычных товаров */}
            {productItems.length > 0 && (
              <>
                {fabricItems.length > 0 && <h2 className={styles.categoryTitle}>Мебель</h2>}
                {productItems.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.itemImage}>
                      <img src={`/${item.image}`} alt={item.name} />
                    </div>

                    <div className={styles.itemInfo}>
                      <Link to={`/product/${item.id}`} className={styles.itemName}>
                        {item.name}
                      </Link>
                      <div className={styles.itemDetails}>
                        {item.dimension && (
                          <span>Размер: {item.dimension.width}x{item.dimension.length} см</span>
                        )}
                        {item.additionalOption && (
                          <span>Опция: {item.additionalOption.name}</span>
                        )}
                      </div>
                    </div>

                    <div className={styles.itemPrice}>
                      {item.price} BYN
                    </div>

                    <div className={styles.quantityControl}>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <div className={styles.itemTotal}>
                      {item.price * item.quantity} BYN
                    </div>

                    <button
                      className={styles.removeButton}
                      onClick={() => handleRemove(item.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className={styles.summary}>
            <div className={styles.promoCode}>
              {appliedPromo ? (
                <div className={styles.appliedPromo}>
                  <span>Промокод: {appliedPromo}</span>
                  <button onClick={handleRemovePromo} className={styles.removePromo}>
                    ×
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePromoSubmit} className={styles.promoForm}>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Введите промокод"
                    className={styles.promoInput}
                  />
                  <button type="submit" className={styles.promoButton}>
                    Применить
                  </button>
                </form>
              )}
              {promoError && <div className={styles.promoError}>{promoError}</div>}
            </div>

            <div className={styles.summaryRow}>
              <span>Подытог:</span>
              <span>{subtotal} BYN</span>
            </div>
            {discount > 0 && (
              <div className={styles.summaryRow}>
                <span>Скидка:</span>
                <span className={styles.discount}>-{discount} BYN</span>
              </div>
            )}
            <div className={styles.summaryRow}>
              <span>Итого:</span>
              <span className={styles.totalPrice}>{totalPrice} BYN</span>
            </div>
            <button
              className={styles.checkoutButton}
              onClick={() => setIsCheckout(true)}
            >
              Оформить заказ
            </button>
            <Link to="/catalog" className={styles.continueShopping}>
              Продолжить покупки
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
