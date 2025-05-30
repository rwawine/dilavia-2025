import { SEO } from '../../components/SEO/SEO';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

export default function NotFound() {
    return (
        <>
            <SEO 
                title="Dilavia - Page Not Found"
                description="The page you are looking for does not exist"
                keywords="Dilavia, 404, not found"
            />
            <div className={styles.notFound}>
                <h1 className={styles.title}>404</h1>
                <p className={styles.text}>Page Not Found</p>
                <Link to="/" className={styles.link}>
                    Return to Home
                </Link>
            </div>
        </>
    );
} 