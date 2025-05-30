import { SEO } from '../../components/SEO/SEO';
import Hero from './Hero/Hero';
import PopularProduct from '../../components/PopularProduct/PopularProduct';

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
        </>
    );
}
