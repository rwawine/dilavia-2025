import { useEffect, useState } from 'react';
import styles from './Loader.module.css';

const Loader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHidden(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 1000);
    }, 2200); // Увеличиваем время показа, чтобы успеть увидеть текст

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`${styles.preloader} ${isHidden ? styles.hidden : ''}`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 17.600000381469727 183.60000610351562 35.85000228881836">
        <path className={styles.animatedLetter} d="M28.60 35.25Q28.60 44.30 23.68 48.87Q18.75 53.45 9.95 53.45L0 53.45L0 17.75L11 17.75Q16.40 17.75 20.35 19.75Q24.30 21.75 26.45 25.62Q28.60 29.50 28.60 35.25M23.85 35.40Q23.85 28.25 20.32 24.92Q16.80 21.60 10.35 21.60L4.50 21.60L4.50 49.60L9.35 49.60Q23.85 49.60 23.85 35.40Z"/>
        <path className={styles.animatedLetter} d="M46.55 53.45L33.65 53.45L33.65 50.85L37.85 49.90L37.85 21.35L33.65 20.35L33.65 17.75L46.55 17.75L46.55 20.35L42.35 21.35L42.35 49.90L46.55 50.85L46.55 53.45Z"/>
        <path className={styles.animatedLetter} d="M53.45 53.45L53.45 17.75L57.95 17.75L57.95 49.45L73.55 49.45L73.55 53.45L53.45 53.45Z"/>
        <path className={styles.animatedLetter} d="M102.05 53.45L97.75 42.40L83.60 42.40L79.35 53.45L74.80 53.45L88.75 17.60L92.80 17.60L106.70 53.45L102.05 53.45M92.40 27.60Q92.25 27.20 91.90 26.15Q91.55 25.10 91.22 23.97Q90.90 22.85 90.70 22.25Q90.35 23.80 89.90 25.27Q89.45 26.75 89.15 27.60L85.10 38.40L96.40 38.40L92.40 27.60Z"/>
        <path className={styles.animatedLetter} d="M134.75 17.75L122 53.45L117.50 53.45L104.75 17.75L109.45 17.75L117.50 40.65Q118.30 42.85 118.85 44.77Q119.40 46.70 119.75 48.45Q120.10 46.70 120.65 44.75Q121.20 42.80 122 40.55L130 17.75L134.75 17.75Z"/>
        <path className={styles.animatedLetter} d="M149.65 53.45L136.75 53.45L136.75 50.85L140.95 49.90L140.95 21.35L136.75 20.35L136.75 17.75L149.65 17.75L149.65 20.35L145.45 21.35L145.45 49.90L149.65 50.85L149.65 53.45Z"/>
        <path className={styles.animatedLetter} d="M178.95 53.45L174.65 42.40L160.50 42.40L156.25 53.45L151.70 53.45L165.65 17.60L169.70 17.60L183.60 53.45L178.95 53.45M169.30 27.60Q169.15 27.20 168.80 26.15Q168.45 25.10 168.13 23.97Q167.80 22.85 167.60 22.25Q167.25 23.80 166.80 25.27Q166.35 26.75 166.05 27.60L162 38.40L173.30 38.40L169.30 27.60Z"/>
      </svg>
      <p className={styles.slogan}>Мы заботимся о вашем комфорте</p>
    </div>
  );
};

export default Loader; 