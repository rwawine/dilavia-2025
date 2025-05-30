import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useFavoritesStore } from '../../store/favoritesStore';
import styles from './Header.module.css';

// Импорт SVG иконок
import HeartIcon from './icons/HeartIcon';
import CartIcon from './icons/CartIcon';
import PhoneIcon from './icons/PhoneIcon';
import ArrowDownIcon from './icons/ArrowDownIcon';

// Определение интерфейсов
interface HeaderProps {
  phones?: {
    mts?: string;
    life?: string;
  };
}

const Header: React.FC<HeaderProps> = ({
  phones = {
    mts: '+38 (095) 479 69 75',
    life: '+38 (067) 579 69 75',
  },
}) => {
  // Состояния для выпадающих меню
  const [isPhoneExpanded, setIsPhoneExpanded] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [isNavMenuExpanded, setIsNavMenuExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCartStore();
  const { favorites } = useFavoritesStore();

  // Определение мобильного устройства
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Примерное содержимое для выпадающего меню навигации
  const navMenuItems = [
    { title: 'Кровати', url: '/catalog/bed' },
    { title: 'Диваны', url: '/catalog/sofa' },
    { title: 'Кресла', url: '/catalog/armchair' },
  ];

  // Мобильное меню
  const mobileMenuItems = [
    { title: 'Главная', url: '/' },
    { title: 'Каталог', url: '/catalog', items: navMenuItems },
    { title: 'Доставка и оплата', url: '/delivery' },
    { title: 'Ткани', url: '/fabric' },
    { title: 'О нас', url: '/about' },
    { title: 'Контакты', url: '/contacts' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.header__wrapper}>
        <div className={styles.header__content}>
          {/* Логотип */}
          <div className={styles.header__logo} tabIndex={0}>
            <Link to="/"> Dilavia</Link>
          </div>

          {/* Навигация */}
          <nav className={styles.header__navigation}>
            <Link className={styles.header__link} to="/">Главная</Link>
            <div 
              className={styles.header__link_menu}
              onMouseEnter={() => !isMobile && setIsNavMenuExpanded(true)}
              onMouseLeave={() => !isMobile && setIsNavMenuExpanded(false)}
            >
              <div className={styles.header__link}>
                <Link to="/catalog" className={styles.header__link_text}>Каталог</Link>
                <div 
                  className={styles.header__link_arrow}
                  onClick={() => setIsNavMenuExpanded(!isNavMenuExpanded)}
                >
                  <ArrowDownIcon className={`${styles.icon} ${isNavMenuExpanded ? styles.icon_rotated : ''}`} />
                </div>
              </div>
              {isNavMenuExpanded && (
                <div className={styles.header__expander}>
                  <div className={`${styles.expander} ${styles.menu_expander}`}>
                    <div className={styles.menu_expander__content}>
                      {navMenuItems.map((item, index) => (
                        <Link key={index} to={item.url} className={styles.menu_expander__item}>
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Link className={styles.header__link} to="/delivery">Доставка и оплата</Link>
            <Link className={styles.header__link} to="/fabric">Ткани</Link>
            <Link className={styles.header__link} to="/about">О нас</Link>
            <Link className={styles.header__link} to="/contacts">Контакты</Link>
          </nav>

          {/* Социальные сети */}
          <div className={styles.header__social}>
            <a href="https://www.instagram.com/ninjapizzaofficial/" target="_blank" rel="noopener noreferrer" className={styles.header__social_link}>
              <span className={styles.icon}>instagram</span>
            </a>
          </div>

          {/* Информация (телефон, избранное, корзина) */}
          <div className={styles.header__info}>
            {/* Телефон */}
            <div 
              className={styles.header__info_phone}
              onMouseEnter={() => !isMobile && setIsPhoneExpanded(true)}
              onMouseLeave={() => !isMobile && setIsPhoneExpanded(false)}
              onClick={() => isMobile && setIsPhoneExpanded(!isPhoneExpanded)}
            >
              <div className={styles.header__info_link}>
                <PhoneIcon className={styles.icon} />
                <a className={styles.header__info_title} href={`tel:${phones.life}`}>
                  {phones.life}
                </a>
              </div>
              {isPhoneExpanded && (
                <div className={styles.header__expander}>
                  <div className={`${styles.expander} ${styles.phone_expander}`}>
                    <div className={styles.phone_expander__links}>
                      <a className={`${styles.phone_expander__link} ${styles.mts}`} href={`tel:${phones.mts}`}>
                        <span className={styles.icon}></span> {phones.mts}
                      </a>
                      <a className={`${styles.phone_expander__link} ${styles.life}`} href={`tel:${phones.life}`}>
                        <span className={styles.icon}></span> {phones.life}
                      </a>
                    </div>
                    <div className={styles.expander__small}>Звоните нам с 08:00 до 20:00 без выходных</div>
                  </div>
                </div>
              )}
            </div>

            {/* Избранное */}
            <div className={styles.header__info_favorite}>
              <Link to="/favorite" className={styles.header__info_link}>
                <HeartIcon className={`${styles.icon} ${favorites.length > 0 ? styles.mat_badge : ''}`} />
                {favorites.length > 0 && (
                  <span className={styles.mat_badge_content}>{favorites.length}</span>
                )}
              </Link>
            </div>

            {/* Корзина */}
            <div className={styles.header__info_cart}>
              <Link to="/cart" className={styles.header__info_link}>
                <CartIcon className={`${styles.icon} ${totalItems() > 0 ? styles.mat_badge : ''}`} />
                {totalItems() > 0 && (
                  <span className={styles.mat_badge_content}>{totalItems()}</span>
                )}
              </Link>
            </div>

            {/* Мобильное меню */}
            <div className={styles.header__info_menu}>
              <div 
                className={`${styles.header__info_menu_btn} ${styles.menu_btn} ${isMenuExpanded ? styles.menu_btn_active : ''}`} 
                onClick={() => setIsMenuExpanded(!isMenuExpanded)}
              >
                <span className={styles.menu_btn__span}></span>
                <span className={styles.menu_btn__span}></span>
                <span className={styles.menu_btn__span}></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Мобильная навигация */}
      {isMenuExpanded && (
        <div className={styles.header_nav}>
          <div className={styles.mobile_menu}>
            {mobileMenuItems.map((item, index) => (
              <div key={index} className={styles.mobile_menu__item}>
                <Link to={item.url} className={styles.mobile_menu__link}>
                  {item.title}
                </Link>
                {item.items && (
                  <div className={styles.mobile_menu__submenu}>
                    {item.items.map((subItem, subIndex) => (
                      <Link key={subIndex} to={subItem.url} className={styles.mobile_menu__sublink}>
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Оверлей для закрытия меню при клике вне */}
      {(isPhoneExpanded || isMenuExpanded) && isMobile && (
        <div 
          className={styles.header__overlay} 
          onClick={() => {
            setIsPhoneExpanded(false);
            setIsMenuExpanded(false);
          }}
        ></div>
      )}
    </header>
  );
};

export default Header;
