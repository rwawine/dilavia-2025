import styles from './Footer.module.css'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.grid}>
                    {/* Блок 1: Контактная информация */}
                    <div className={styles.column}>
                        <h3 className={styles.title}>Свяжитесь с нами</h3>
                        <div className={styles.block}>
                            <div className={styles.contactItem}>
                                <a href="mailto:sales@dilchenboru.ru" className={styles.link}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                    infomiagkhikomfort@gmail.com
                                </a>
                            </div>
                            <div className={styles.contactItem}>
                                <a href="tel:+375336641830" className={styles.link}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path
                                            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z">
                                        </path>
                                    </svg>
                                    +375 (33) 664-18-30
                                </a>
                            </div>
                            <div className={styles.contactItem}>
                                <a href="tel:+37528019271" className={styles.link}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path
                                            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z">
                                        </path>
                                    </svg>
                                    +375 (29) 801-92-71
                                </a>
                            </div>
                            <div className={styles.contactItem}>
                                <a href="https://t.me/dilavia" target="_blank" className={styles.link}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path
                                            d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z">
                                        </path>
                                    </svg>
                                    Telegram
                                </a>
                            </div>
                            <div className={styles.contactItem}>
                                <a href="https://www.instagram.com/dilavia.by?igshid=NGVhN2U2NjQ0Yg%3D%3D" target="_blank"
                                    className={styles.link}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM12 15.88C9.86 15.88 8.12 14.14 8.12 12C8.12 9.86 9.86 8.12 12 8.12C14.14 8.12 15.88 9.86 15.88 12C15.88 14.14 14.14 15.88 12 15.88ZM17.92 6.88C17.87 7 17.8 7.11 17.71 7.21C17.61 7.3 17.5 7.37 17.38 7.42C17.26 7.47 17.13 7.5 17 7.5C16.73 7.5 16.48 7.4 16.29 7.21C16.2 7.11 16.13 7 16.08 6.88C16.03 6.76 16 6.63 16 6.5C16 6.37 16.03 6.24 16.08 6.12C16.13 5.99 16.2 5.89 16.29 5.79C16.52 5.56 16.87 5.45 17.19 5.52C17.26 5.53 17.32 5.55 17.38 5.58C17.44 5.6 17.5 5.63 17.56 5.67C17.61 5.7 17.66 5.75 17.71 5.79C17.8 5.89 17.87 5.99 17.92 6.12C17.97 6.24 18 6.37 18 6.5C18 6.63 17.97 6.76 17.92 6.88Z"
                                            fill="currentColor" />
                                    </svg>
                                    Instagram
                                </a>
                            </div>
                            <div className={styles.hours}>Работаем ежедневно 24/7</div>
                        </div>
                    </div>

                    {/* Блок 2: Информация для клиентов */}
                    <div className={styles.column}>
                        <h3 className={styles.title}>Клиентам</h3>
                        <div className={styles.block}>
                            <div className={styles.linksGroup}>
                                <a href="/about" className={styles.link}>О нас</a>
                                <a href="/delivery" className={styles.link}>Доставка</a>
                                <a href="/contacts" className={styles.link}>Контакты</a>
                            </div>
                        </div>
                    </div>

                    {/* Блок 3: Категории мебели */}
                    <div className={styles.column}>
                        <h3 className={styles.title}>Мебель</h3>
                        <div className={styles.block}>
                            <div className={styles.linksGroup}>
                                <a href="/catalog/sofa" className={styles.link}>Диваны</a>
                                <a href="/catalog/bed" className={styles.link}>Кровати</a>
                                <a href="/catalog/armchair" className={styles.link}>Кресла</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
