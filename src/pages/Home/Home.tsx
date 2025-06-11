import { useEffect, useState } from 'react';
import { SEO } from '../../components/SEO/SEO';
import Hero from './Hero/Hero';
import PopularProduct from '../../components/PopularProduct/PopularProduct';
import Benefits from './Benefits/Benefits';
import SliderBenefits from './SliderBenefits/SliderBenefits';
import Copirate from './Copirate/Copirate';
import SizeVisual from './SizeVisual/SizeVisual';
import ReviewsGroup from '../../components/ReviewsGroup/ReviewsGroup';
import Loader from '../../components/Loader/Loader';
import styles from './Home.module.css';

export default function Home() {
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        const hasVisited = sessionStorage.getItem('hasVisited');
        if (!hasVisited) {
            setShowLoader(true);
            sessionStorage.setItem('hasVisited', 'true');
        }
    }, []);

    return (
        <>
            {showLoader && <Loader />}
            <SEO
                title="Купить диван в Минске недорого, каталог диванов, кроватей и кресел с ценами и фото"
                description="Купить диван в Минске недорого, каталог диванов, кроватей и кресел с ценами и фото. Доставка по всей Республике Беларусь. Гарантия качества. Оплата онлайн и наличными при получении. Рассрочка без %"
                keywords="диваны, кровати, кресла, мебель, интернет-магазин мебели, купить мебель онлайн, доставка мебели, DILAVIA, мебель оптом, мебель в розницу, качественная мебель, натуральная мебель"
                image="/images/logo.png"
                url="https://dilavia.by/"
            />
            <h1 className={styles.visuallyHidden}>DILAVIA - интернет-магазин мебели в Минске. Диваны, кровати и кресла с доставкой по Беларуси</h1>
            <Hero />
            <PopularProduct />
            <Benefits />
            <SliderBenefits />
            <Copirate />
            <SizeVisual /> 
            <ReviewsGroup />
        </>
    );
}
