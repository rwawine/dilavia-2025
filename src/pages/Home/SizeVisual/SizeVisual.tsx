import React from 'react'
import styles from './SizeVisual.module.css'

export default function SizeVisual() {
  return (
    <section className={styles.sizeVisual}>
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.content}>
            <div className={styles.left}>
              <div className={styles.label}>мебель для дома</div>
              <h2 className={styles.title}>
                Если у вас уже есть визуализация
                <span style={{ color: '#8b7f6e', marginLeft: '10px' }}>проекта</span> — мы готовы
                рассчитать стоимость его реализации
              </h2>
              <p className={styles.description}>
                Пришлите нам визуализацию или чертежи вашего проекта, и мы
                оперативно рассчитаем стоимость изготовления мебели по вашим
                требованиям.
              </p>
            </div>
            <a href="#" className={styles.btn}>
                Отправить проект
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
