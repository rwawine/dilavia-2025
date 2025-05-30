'use client'

import { useState } from 'react'
import styles from './Copirate.module.css'
import ModalContactForm from '@/components/ModalContactForm/ModalContactForm'

export default function Copirate() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <section className={styles.copirate}>
      <div className="container">
        <div className={styles.collaboration}>
          <div className={styles.content}>
            <div>
              <h2 className={styles.title}>
                Сотрудничество с&nbsp;дизайнерами
              </h2>
              <p className={styles.description}>
                Мы предлагаем дизайнерам выгодные условия сотрудничества и
                бонусную программу
              </p>
            </div>
            <button 
              className={styles.btn}
              onClick={() => setIsModalOpen(true)}
            >
              Обсудить проект
            </button>
          </div>
          <div className={styles.features}>
            <div className={styles.featureWrapper}>
              <div className={styles.feature}>
                <div className={styles.front}>
                  <div className={styles.icon}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M30 10H10C6.68629 10 4 12.6863 4 16V24C4 27.3137 6.68629 30 10 30H30C33.3137 30 36 27.3137 36 24V16C36 12.6863 33.3137 10 30 10Z"
                        stroke="currentColor" strokeWidth="2" />
                      <path d="M15 20L18 23L25 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className={styles.featureTitle}>Надежный партнер</h3>
                </div>
                <div className={styles.back}>
                  <h3 className={styles.backTitle}>Надежный партнер</h3>
                  <p className={styles.featureDescription}>
                    Уже 15 лет мы реализуем проекты с высокой надежностью. Вы
                    сможете реализовать с нами любой элемент мебели - своего
                    проекта.
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.featureWrapper}>
              <div className={styles.feature}>
                <div className={styles.front}>
                  <div className={styles.icon}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 12H32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M8 20H32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M8 28H32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="14" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
                      <circle cx="26" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
                      <circle cx="14" cy="28" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <h3 className={styles.featureTitle}>Комфортные условия</h3>
                </div>
                <div className={styles.back}>
                  <h3 className={styles.backTitle}>Комфортные условия</h3>
                  <p className={styles.featureDescription}>
                    Гарантируем соблюдение сроков, высокие стандарты качества,
                    широкий выбор материалов и постоянное присутствие на связи
                    😉
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.featureWrapper}>
              <div className={styles.feature}>
                <div className={styles.front}>
                  <div className={styles.icon}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="8" y="8" width="24" height="24" rx="2" stroke="currentColor" strokeWidth="2" />
                      <path d="M14 20L18 24L26 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className={styles.featureTitle}>Техническая поддержка</h3>
                </div>
                <div className={styles.back}>
                  <h3 className={styles.backTitle}>Техническая поддержка</h3>
                  <p className={styles.featureDescription}>
                    Наша команда окажет поддержку по техническим вопросам
                    проектирования мебели и ремонта.
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.featureWrapper}>
              <div className={styles.feature}>
                <div className={styles.front}>
                  <div className={styles.icon}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 20H28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M20 12L20 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <h3 className={styles.featureTitle}>Полное соответствие</h3>
                </div>
                <div className={styles.back}>
                  <h3 className={styles.backTitle}>Полное соответствие</h3>
                  <p className={styles.featureDescription}>
                    При реализации проекта мы учтем все нюансы и изготовим
                    мебель с исключительным соответствием вашим чертежам.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalContactForm 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  )
}
