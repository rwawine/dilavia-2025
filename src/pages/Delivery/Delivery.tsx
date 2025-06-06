import { useState, useRef, useEffect } from 'react'
import styles from './Delivery.module.css'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'
import { SEO } from '../../components/SEO/SEO'

interface FAQItem {
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    question: 'Как осуществляется доставка?',
    answer: 'Доставка осуществляется по всей Беларуси. В Минске доставка бесплатная. В другие города доставка осуществляется через транспортные компании - бесплатно.'
  },
  {
    question: 'Какие способы оплаты доступны?',
    answer: 'Мы принимаем оплату наличными при получении, банковской картой через терминал курьера, а также безналичным расчетом для юридических лиц.'
  },
  {
    question: 'Как долго изготавливается мебель?',
    answer: 'Срок изготовления мебели зависит от модели и загруженности производства. В среднем, изготовление занимает от 2 до 4 недель. Точные сроки уточняйте у менеджера.'
  },
  {
    question: 'Есть ли гарантия на мебель?',
    answer: 'Да, на всю нашу мебель предоставляется гарантия 18 месяцев. В течение гарантийного срока мы бесплатно устраняем производственные дефекты.'
  },
  {
    question: 'Можно ли вернуть или обменять мебель?',
    answer: 'Да, в течение 14 дней с момента получения вы можете вернуть или обменять мебель, если она осталась в заводской упаковке. Мебель должна быть в идеальном состоянии.'
  }
]

function Delivery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const answerRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // Инициализируем refs массив
    answerRefs.current = answerRefs.current.slice(0, faqItems.length)
  }, [])

  const toggleItem = (index: number) => {
    if (openIndex === index) {
      // Закрываем текущий элемент
      const element = answerRefs.current[index]
      if (element) {
        element.style.height = '0px'
        setTimeout(() => {
          setOpenIndex(null)
        }, 300) // Время должно совпадать с transition в CSS
      }
    } else {
      // Закрываем предыдущий элемент, если он был открыт
      if (openIndex !== null) {
        const prevElement = answerRefs.current[openIndex]
        if (prevElement) {
          prevElement.style.height = '0px'
        }
      }

      // Открываем новый элемент
      const element = answerRefs.current[index]
      if (element) {
        element.style.height = `${element.scrollHeight}px`
        setOpenIndex(index)
      }
    }
  }

  return (
    <>
      <SEO
        title="Доставка и оплата | DILAVIA - Интернет-магазин мебели"
        description="Условия доставки и оплаты в интернет-магазине DILAVIA. Бесплатная доставка по Минску. Доставка по всей Беларуси. Гарантия 18 месяцев. Возврат в течение 14 дней."
        keywords="доставка мебели, оплата мебели, гарантия на мебель, возврат мебели, DILAVIA, доставка по Беларуси, бесплатная доставка"
      />
      <div className={styles.container}>
        <Breadcrumbs items={[
          { name: 'Главная', path: '/' },
          { name: 'Доставка и оплата', path: '/delivery' },
        ]} />
        <h1 className={styles.title}>Доставка и оплата</h1>

        <div className={styles.faqSection}>
          <h2 className={styles.sectionTitle}>Часто задаваемые вопросы</h2>
          <div className={styles.faqList}>
            {faqItems.map((item, index) => (
              <div
                key={index}
                className={`${styles.faqItem} ${openIndex === index ? styles.faqItemOpen : ''}`}
              >
                <button
                  className={styles.faqQuestion}
                  onClick={() => toggleItem(index)}
                  aria-expanded={openIndex === index}
                >
                  {item.question}
                  <span className={styles.arrow} />
                </button>
                <div
                  ref={el => answerRefs.current[index] = el}
                  className={styles.faqAnswer}
                  style={{ height: '0px' }}
                >
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Delivery
