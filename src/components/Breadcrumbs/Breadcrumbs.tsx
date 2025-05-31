import { Link } from 'react-router-dom'
import styles from './Breadcrumbs.module.css'

interface BreadcrumbItem {
  name: string
  path: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className={styles.breadcrumbs}>
      {items.map((item, index) => (
        <div key={item.path} className={styles.item}>
          {index > 0 && <span className={styles.separator}>/</span>}
          {index === items.length - 1 ? (
            <span className={styles.current}>{item.name}</span>
          ) : (
            <Link to={item.path} className={styles.link}>
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
} 