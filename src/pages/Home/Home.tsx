import { SEO } from '../../components/SEO/SEO';
import Hero from './Hero/Hero';
import PopularProduct from '../../components/PopularProduct/PopularProduct';
import Benefits from './Benefits/Benefits';
import SliderBenefits from './SliderBenefits/SliderBenefits';
import Copirate from './Copirate/Copirate';
import SizeVisual from './SizeVisual/SizeVisual';
export default function Home() {
    return (
        <>
            <SEO
                title="Dilavia - Home"
                description="Welcome to Dilavia - Your Home Page"
                keywords="Dilavia, home, main page"
            />
            <Hero />
            <PopularProduct />
            <Benefits />
            <SliderBenefits />
            <Copirate />
            <SizeVisual />
        </>
    );
}
