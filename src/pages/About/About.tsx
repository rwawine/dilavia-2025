import { useState, useRef, useEffect } from 'react'
import { SEO } from '../../components/SEO/SEO'
import styles from './About.module.css'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'

interface FAQItem {
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    question: 'Кто мы?',
    answer: 'Dilavia - это современная мебельная компания, специализирующаяся на производстве качественной мебели для дома. Мы создаем уютные и стильные решения для вашего интерьера, используя только лучшие материалы и современные технологии.'
  },
  {
    question: 'Наша миссия',
    answer: 'Мы стремимся создавать мебель, которая не только красива, но и функциональна, долговечна и доступна. Наша цель - помочь каждому клиенту создать идеальное пространство для жизни, где комфорт сочетается со стилем.'
  },
  {
    question: 'Почему выбирают нас?',
    answer: 'Мы предлагаем индивидуальный подход к каждому клиенту, гарантируем качество нашей продукции, используем экологичные материалы и предоставляем профессиональную поддержку на всех этапах сотрудничества.'
  },
  {
    question: 'Наше производство',
    answer: 'Наше производство оснащено современным оборудованием, что позволяет нам создавать мебель высокого качества. Мы контролируем каждый этап производства, от выбора материалов до финальной сборки.'
  },
  {
    question: 'Наши ценности',
    answer: 'Качество, инновации, экологичность и забота о клиентах - вот основные ценности, которыми мы руководствуемся в нашей работе. Мы постоянно совершенствуемся и следим за последними тенденциями в мире мебели.'
  }
]

export default function About() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const answerRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    answerRefs.current = answerRefs.current.slice(0, faqItems.length)
  }, [])

  const toggleItem = (index: number) => {
    if (openIndex === index) {
      const element = answerRefs.current[index]
      if (element) {
        element.style.height = '0px'
        setTimeout(() => {
          setOpenIndex(null)
        }, 300)
      }
    } else {
      if (openIndex !== null) {
        const prevElement = answerRefs.current[openIndex]
        if (prevElement) {
          prevElement.style.height = '0px'
        }
      }
      
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
        title="Dilavia - О компании"
        description="Узнайте больше о компании Dilavia, нашей миссии и ценностях"
        keywords="Dilavia, о компании, мебель, производство"
      />
      <div className={styles.container}>
        <Breadcrumbs items={[
          { name: 'Главная', path: '/' },
          { name: 'О нас', path: '/about' },
        ]} />
        <h1 className={styles.title}>О нас</h1>
        
        <div className={styles.content}>
          <div className={styles.mainInfo}>
            <p className={styles.description}>
              Dilavia - это современная мебельная компания, которая создает качественную и стильную мебель для вашего дома. 
              Мы гордимся тем, что предлагаем нашим клиентам не просто мебель, а настоящие решения для комфортной жизни.
            </p>
            
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>10+</span>
                <span className={styles.statText}>лет на рынке</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>1000+</span>
                <span className={styles.statText}>довольных клиентов</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>500+</span>
                <span className={styles.statText}>моделей мебели</span>
              </div>
            </div>
          </div>

          <div className={styles.faqSection}>
            <h2 className={styles.sectionTitle}>Подробнее о нас</h2>
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
      </div>
    </>
  )
} 