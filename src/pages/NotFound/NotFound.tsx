import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SEO } from '../../components/SEO/SEO'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'
import styles from './NotFound.module.css'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <>
      <SEO
        title="404 - Страница не найдена | DILAVIA"
        description="Страница не найдена. Вернитесь на главную страницу DILAVIA или воспользуйтесь навигацией сайта."
        noindex={true}
      />
      <div className={styles.container}>
        <Breadcrumbs items={[
          { name: 'Главная', path: '/' },
          { name: '404', path: '/404' }
        ]} />
        
        <div className={styles.content}>
          <h1 className={styles.title}>404</h1>
          <h2 className={styles.subtitle}>Страница не найдена</h2>
          <p className={styles.description}>
            К сожалению, запрашиваемая страница не существует или была перемещена.
          </p>
          <div className={styles.actions}>
            <button 
              className={styles.button}
              onClick={() => navigate(-1)}
            >
              Вернуться назад
            </button>
            <button 
              className={`${styles.button} ${styles.primary}`}
              onClick={() => navigate('/')}
            >
              На главную
            </button>
          </div>
        </div>
      </div>
    </>
  )
} 