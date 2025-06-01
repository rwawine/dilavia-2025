import { SEO } from '../../components/SEO/SEO';
import Hero from './Hero/Hero';
import PopularProduct from '../../components/PopularProduct/PopularProduct';
import Benefits from './Benefits/Benefits';
import SliderBenefits from './SliderBenefits/SliderBenefits';
import Copirate from './Copirate/Copirate';
import SizeVisual from './SizeVisual/SizeVisual';
import ReviewsGroup from '../../components/ReviewsGroup/ReviewsGroup';

export default function Home() {
    return (
        <>
            <SEO
                title="Купить диван в Минске недорого, каталог диванов, кроватей и кресел с ценами и фото"
                description="Купить диван в Минске недорого, каталог диванов, кроватей и кресел с ценами и фото. Доставка по всей Республике Беларусь. Гарантия качества. Оплата онлайн и наличными при получении."
                keywords="диваны, кровати, кресла, мебель, интернет-магазин мебели, купить мебель онлайн, доставка мебели, DILAVIA, мебель оптом, мебель в розницу, качественная мебель, натуральная мебель"
            />
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
