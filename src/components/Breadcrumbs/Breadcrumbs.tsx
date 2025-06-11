import { Link } from 'react-router-dom'
import { SEO } from '../SEO/SEO'
import styles from './Breadcrumbs.module.css'

interface BreadcrumbItem {
  name: string
  path: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const breadcrumbSchema = items.map((item, index) => ({
    "@type": "ListItem" as const,
    position: index + 1,
    name: item.name,
    item: `https://dilavia.by${item.path}`
  }));

  return (
    <>
      <SEO breadcrumbs={breadcrumbSchema} />
      <nav className={styles.breadcrumbs}>
        {items.map((item, index) => (
          <div key={item.path} className={styles.item}>
            {index > 0 && <span className={styles.separator}>/</span>}
            {index === items.length - 1 ? (
              <span className={styles.current}>{item.name}</span>
            ) : (
              <Link to={item.path} className={styles.link} title={`Перейти в раздел ${item.name}`}>
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </>
  )
} 