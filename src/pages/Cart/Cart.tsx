import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'
import styles from './Cart.module.css'

interface CheckoutForm {
  fullName: string
  phone: string
  address: string
  contactMethod: 'phone' | 'telegram' | 'whatsapp' | 'viber'
  paymentMethod: 'card' | 'cash'
}

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [isCheckout, setIsCheckout] = useState(false)
  const [formData, setFormData] = useState<CheckoutForm>({
    fullName: '',
    phone: '',
    address: '',
    contactMethod: 'phone',
    paymentMethod: 'card'
  })
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

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

    if (promoCode.toLowerCase() === 'sale10') {
      setAppliedPromo(promoCode)
      setPromoCode('')
    } else {
      setPromoError('Неверный промокод')
    }
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSubmitStatus('idle')

    try {
      // Здесь будет отправка данных на сервер
      await new Promise(resolve => setTimeout(resolve, 1500)) // Имитация запроса
      
      setSubmitStatus('success')
      clearCart()
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  // Разделяем товары на обычные продукты и ткани
  const fabricItems = items.filter(item => item.id.includes('-') && item.price === 0)
  const productItems = items.filter(item => !item.id.includes('-') || item.price > 0)

  const subtotal = productItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = appliedPromo ? subtotal * 0.1 : 0
  const totalPrice = subtotal - discount

  if (items.length === 0 && !isCheckout) {
    return (
      <div className={styles.container}>
        <Breadcrumbs items={[
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
    )
  }

  if (submitStatus === 'success') {
    return (
      <div className={styles.container}>
        <Breadcrumbs items={[
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
    )
  }

  if (isCheckout) {
    return (
      <div className={styles.container}>
        <Breadcrumbs items={[
          { name: 'Корзина', path: '/cart' },
          { name: 'Оформление заказа', path: '/cart/checkout' },
        ]} />
        <h1 className={styles.title}>Оформление заказа</h1>
        
        <div className={styles.cartContent}>
          <form onSubmit={handleSubmit} className={styles.checkoutForm}>
            <div className={styles.formGroup}>
              <label htmlFor="fullName" className={styles.formLabel}>ФИО</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleFormChange}
                required
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.formLabel}>Номер телефона</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                required
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="address" className={styles.formLabel}>Адрес доставки</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                required
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Удобный способ связи</label>
              <div className={styles.contactMethods}>
                <label className={styles.contactMethod}>
                  <input
                    type="radio"
                    name="contactMethod"
                    value="phone"
                    checked={formData.contactMethod === 'phone'}
                    onChange={handleFormChange}
                  />
                  <span>По телефону</span>
                </label>
                <label className={styles.contactMethod}>
                  <input
                    type="radio"
                    name="contactMethod"
                    value="telegram"
                    checked={formData.contactMethod === 'telegram'}
                    onChange={handleFormChange}
                  />
                  <span>Telegram</span>
                </label>
                <label className={styles.contactMethod}>
                  <input
                    type="radio"
                    name="contactMethod"
                    value="whatsapp"
                    checked={formData.contactMethod === 'whatsapp'}
                    onChange={handleFormChange}
                  />
                  <span>WhatsApp</span>
                </label>
                <label className={styles.contactMethod}>
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

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Способ оплаты</label>
              <div className={styles.paymentMethods}>
                <label className={styles.paymentMethod}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleFormChange}
                  />
                  <span>Банковской картой</span>
                </label>
                <label className={styles.paymentMethod}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleFormChange}
                  />
                  <span>Наличными при получении</span>
                </label>
              </div>
            </div>

            {submitStatus === 'error' && (
              <div className={styles.errorMessage}>
                Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.
              </div>
            )}

            <button 
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Отправка...' : 'Отправить заказ'}
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
    )
  }

  return (
    <div className={styles.container}>
      <Breadcrumbs items={[
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
  )
}
