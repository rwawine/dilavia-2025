import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import styles from './Catalog.module.css'
import { Breadcrumbs } from "../../components/Breadcrumbs/Breadcrumbs"

interface Product {
  id: string
  name: string
  slug: string
  images: string[]
  category: {
    code: string
    name: string
  }
  price: {
    current: number
    old: number | null
    discount: number | null
  }
  dimensions: Array<{
    width: number
    length: number
    height: number | null
    depth: number | null
    price: number
    additionalOptions: Array<{
      name: string
      available: boolean
      price: number
    }>
  }>
  popularity: number
  subcategory?: {
    code: string
    name: string
  }
  material: string
  color: string
  style: string
  features: string[]
}

type SortOption = 'popularity' | 'price-asc' | 'price-desc'

export default function Catalog() {
  const { category: categoryParam, subcategory: subcategoryParam } = useParams()
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('popularity')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 })
  const [tempPriceRange, setTempPriceRange] = useState({ min: 0, max: 100000 })
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [tempSelectedCategories, setTempSelectedCategories] = useState<string[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/data/data.json')
        const data = await response.json()
        setProducts(data[0].products)
      } catch (err) {
        setError('Ошибка при загрузке товаров')
        console.error('Error fetching products:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategories([categoryParam])
      if (subcategoryParam) {
        navigate(`/catalog/${categoryParam}/${subcategoryParam}`, { replace: true })
      } else {
        navigate(`/catalog/${categoryParam}`, { replace: true })
      }
    }
  }, [categoryParam, subcategoryParam, navigate])

  const handleSort = (option: SortOption) => {
    setSortBy(option)
  }

  const handleFilterOpen = () => {
    setIsFilterOpen(true)
    setTempPriceRange(priceRange)
    setTempSelectedCategories(selectedCategories)
  }

  const handleFilterClose = () => {
    setIsFilterOpen(false)
  }

  const handleApplyFilters = () => {
    setPriceRange(tempPriceRange)
    setSelectedCategories(tempSelectedCategories)
    
    if (tempSelectedCategories.length > 0) {
      const category = tempSelectedCategories[0]
      const product = products.find(p => p.category.code === category)
      if (product) {
        if (product.subcategory) {
          navigate(`/catalog/${category}/${product.subcategory.code}`)
        } else {
          navigate(`/catalog/${category}`)
        }
      }
    } else {
      navigate('/catalog')
    }
    
    setIsFilterOpen(false)
  }

  const handleResetFilters = () => {
    setTempPriceRange({ min: 0, max: 100000 })
    setPriceRange({ min: 0, max: 100000 })
    setTempSelectedCategories([])
    setSelectedCategories([])
    navigate('/catalog')
  }

  const handleCategoryChange = (categoryCode: string) => {
    setTempSelectedCategories(prev => 
      prev.includes(categoryCode)
        ? prev.filter(code => code !== categoryCode)
        : [categoryCode]
    )
  }

  const uniqueCategories = Array.from(new Set(products.map(product => product.category.code)))

  const filteredAndSortedProducts = products
    .filter(product => {
      const price = product.dimensions[0].price
      const matchesPrice = price >= priceRange.min && price <= priceRange.max
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category.code)
      const matchesSubcategory = !subcategoryParam || (product.subcategory?.code === subcategoryParam)
      return matchesPrice && matchesCategory && matchesSubcategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.dimensions[0].price - b.dimensions[0].price
        case 'price-desc':
          return b.dimensions[0].price - a.dimensions[0].price
        default:
          return b.popularity - a.popularity
      }
    })

  const getFilteredCount = () => {
    return products.filter(product => {
      const price = product.dimensions[0].price
      const matchesPrice = price >= tempPriceRange.min && price <= tempPriceRange.max
      const matchesCategory = tempSelectedCategories.length === 0 || tempSelectedCategories.includes(product.category.code)
      return matchesPrice && matchesCategory
    }).length
  }

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>
  }

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  return (
    <div className={styles.container}>
      <Breadcrumbs items={[
        { name: 'Каталог', path: '/catalog' },
        ...(categoryParam ? [{ name: products.find(p => p.category.code === categoryParam)?.category.name || '', path: `/catalog/${categoryParam}` }] : []),
        ...(subcategoryParam ? [{ name: products.find(p => p.subcategory?.code === subcategoryParam)?.subcategory?.name || '', path: `/catalog/${categoryParam}/${subcategoryParam}` }] : [])
      ]} />
      <div className={styles.header}>
        <h1 className={styles.title}>Каталог</h1>
        <div className={styles.controls}>
          <button className={styles.filterButton} onClick={handleFilterOpen}>
            Фильтры
          </button>
          <select 
            className={styles.sortSelect}
            value={sortBy}
            onChange={(e) => handleSort(e.target.value as SortOption)}
          >
            <option value="popularity">По популярности</option>
            <option value="price-asc">По возрастанию цены</option>
            <option value="price-desc">По убыванию цены</option>
          </select>
        </div>
      </div>

      <div className={styles.products}>
        {filteredAndSortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {isFilterOpen && (
        <div className={styles.overlay} onClick={handleFilterClose}>
          <div className={styles.drawer} onClick={e => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h2>Фильтры</h2>
              <button className={styles.closeButton} onClick={handleFilterClose}>×</button>
            </div>
            
            <div className={styles.filterSection}>
              <h3>Тип товара</h3>
              <div className={styles.categoryFilters}>
                {uniqueCategories.map(categoryCode => {
                  const category = products.find(p => p.category.code === categoryCode)?.category
                  return (
                    <label key={categoryCode} className={styles.categoryLabel}>
                      <input
                        type="checkbox"
                        checked={tempSelectedCategories.includes(categoryCode)}
                        onChange={() => handleCategoryChange(categoryCode)}
                      />
                      {category?.name}
                    </label>
                  )
                })}
              </div>
            </div>

            <div className={styles.filterSection}>
              <h3>Цена</h3>
              <div className={styles.priceInputs}>
                <input
                  type="number"
                  value={tempPriceRange.min}
                  onChange={(e) => setTempPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                  placeholder="От"
                />
                <input
                  type="number"
                  value={tempPriceRange.max}
                  onChange={(e) => setTempPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                  placeholder="До"
                />
              </div>
            </div>

            <div className={styles.drawerFooter}>
            <button className={styles.applyButton} onClick={handleApplyFilters}>
                Применить ({getFilteredCount()})
              </button>
              <button className={styles.resetButton} onClick={handleResetFilters}>
                Сбросить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 