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
  country: string
  maxLoad?: number
  sleepingPlace?: {
    width: number | null
    length: number | null
  }
}

type SortOption = 'popularity' | 'price-asc' | 'price-desc'

interface FilterState {
  priceRange: { min: number; max: number }
  selectedCategories: string[]
  selectedSubcategories: string[]
  selectedColors: string[]
}

export default function Catalog() {
  const { category: categoryParam, subcategory: subcategoryParam } = useParams()
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('popularity')
  
  const [filters, setFilters] = useState<FilterState>({
    priceRange: { min: 0, max: 100000 },
    selectedCategories: [],
    selectedSubcategories: [],
    selectedColors: []
  })

  const [tempFilters, setTempFilters] = useState<FilterState>(filters)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('/data/data.json')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        if (!data || !Array.isArray(data) || !data[0]?.products) {
          throw new Error('Invalid data format')
        }

        // Проверяем структуру данных
        const products = data[0].products
        if (!Array.isArray(products)) {
          throw new Error('Products data is not an array')
        }

        // Проверяем наличие необходимых полей
        const validProducts = products.filter(product => {
          return (
            product.id &&
            product.name &&
            product.slug &&
            Array.isArray(product.images) &&
            product.images.length > 0 &&
            product.category &&
            product.category.code &&
            product.category.name &&
            Array.isArray(product.dimensions) &&
            product.dimensions.length > 0
          )
        })

        if (validProducts.length === 0) {
          throw new Error('No valid products found')
        }

        setProducts(validProducts)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Ошибка при загрузке товаров. Пожалуйста, попробуйте позже.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    const updateFiltersFromUrl = () => {
      const newFilters = { ...filters }
      
      if (categoryParam) {
        newFilters.selectedCategories = [categoryParam]
        
        // Находим категорию в продуктах
        const categoryProduct = products.find(p => p.category.code === categoryParam)
        if (categoryProduct) {
          // Если есть подкатегория в URL, добавляем её
          if (subcategoryParam) {
            newFilters.selectedSubcategories = [subcategoryParam]
          } else {
            // Если подкатегории нет, сбрасываем выбранные подкатегории
            newFilters.selectedSubcategories = []
          }
        }
      } else {
        // Если нет категории в URL, сбрасываем все фильтры категорий
        newFilters.selectedCategories = []
        newFilters.selectedSubcategories = []
      }
      
      setFilters(newFilters)
      setTempFilters(newFilters)
    }

    updateFiltersFromUrl()
  }, [categoryParam, subcategoryParam, products])

  const handleSort = (option: SortOption) => {
    setSortBy(option)
  }

  const handleFilterOpen = () => {
    setIsFilterOpen(true)
    setTempFilters(filters)
  }

  const handleFilterClose = () => {
    setIsFilterOpen(false)
  }

  const handleApplyFilters = () => {
    setFilters(tempFilters)
    
    if (tempFilters.selectedCategories.length > 0) {
      const category = tempFilters.selectedCategories[0]
      const subcategory = tempFilters.selectedSubcategories[0]
      if (subcategory && tempFilters.selectedSubcategories.length === 1) {
        navigate(`/catalog/${category}/${subcategory}`)
      } else {
        // Если выбрано несколько категорий или подкатегорий, переходим в общий каталог
        if (tempFilters.selectedCategories.length > 1 || tempFilters.selectedSubcategories.length > 1) {
          navigate('/catalog')
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
    const resetFilters = {
      priceRange: { min: 0, max: 100000 },
      selectedCategories: [],
      selectedSubcategories: [],
      selectedColors: []
    }
    setFilters(resetFilters)
    setTempFilters(resetFilters)
    navigate('/catalog')
  }

  const handleCategoryChange = (categoryCode: string) => {
    setTempFilters(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(categoryCode)
        ? prev.selectedCategories.filter(code => code !== categoryCode)
        : [...prev.selectedCategories, categoryCode],
      // Сбрасываем подкатегории только если удаляем последнюю категорию
      selectedSubcategories: prev.selectedCategories.length === 1 && prev.selectedCategories.includes(categoryCode)
        ? []
        : prev.selectedSubcategories
    }))
  }

  const handleSubcategoryChange = (subcategoryCode: string) => {
    setTempFilters(prev => ({
      ...prev,
      selectedSubcategories: prev.selectedSubcategories.includes(subcategoryCode)
        ? prev.selectedSubcategories.filter(code => code !== subcategoryCode)
        : [...prev.selectedSubcategories, subcategoryCode]
    }))
  }

  const handleMultiSelectChange = (
    value: string,
    field: keyof Pick<FilterState, 'selectedColors'>
  ) => {
    setTempFilters(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const uniqueCategories = Array.from(new Set(products.map(product => product.category.code)))
  const uniqueSubcategories = Array.from(new Set(
    products
      .filter(product => tempFilters.selectedCategories.includes(product.category.code))
      .map(product => product.subcategory?.code)
      .filter((code): code is string => code !== undefined)
  ))
  const uniqueColors = Array.from(new Set(products.map(product => product.color)))

  const filteredAndSortedProducts = products
    .filter(product => {
      try {
        const hasDimensions = product.dimensions && product.dimensions.length > 0
        const price = hasDimensions ? product.dimensions[0].price : product.price?.current || 0
        const matchesPrice = price >= filters.priceRange.min && price <= filters.priceRange.max
        const matchesCategory = filters.selectedCategories.length === 0 || filters.selectedCategories.includes(product.category.code)
        const matchesSubcategory = filters.selectedSubcategories.length === 0 || filters.selectedSubcategories.includes(product.subcategory?.code || '')
        const matchesColor = filters.selectedColors.length === 0 || filters.selectedColors.includes(product.color)

        return matchesPrice && matchesCategory && matchesSubcategory && matchesColor
      } catch (err) {
        console.error('Error filtering product:', err)
        return false
      }
    })
    .sort((a, b) => {
      try {
        const priceA = a.dimensions && a.dimensions.length > 0 ? a.dimensions[0].price : a.price?.current || 0
        const priceB = b.dimensions && b.dimensions.length > 0 ? b.dimensions[0].price : b.price?.current || 0
        
        switch (sortBy) {
          case 'price-asc':
            return priceA - priceB
          case 'price-desc':
            return priceB - priceA
          default:
            return b.popularity - a.popularity
        }
      } catch (err) {
        console.error('Error sorting products:', err)
        return 0
      }
    })

  const getFilteredCount = () => {
    try {
      return products.filter(product => {
        const hasDimensions = product.dimensions && product.dimensions.length > 0
        const price = hasDimensions ? product.dimensions[0].price : product.price?.current || 0
        const matchesPrice = price >= tempFilters.priceRange.min && price <= tempFilters.priceRange.max
        const matchesCategory = tempFilters.selectedCategories.length === 0 || tempFilters.selectedCategories.includes(product.category.code)
        const matchesSubcategory = tempFilters.selectedSubcategories.length === 0 || tempFilters.selectedSubcategories.includes(product.subcategory?.code || '')
        const matchesColor = tempFilters.selectedColors.length === 0 || tempFilters.selectedColors.includes(product.color)

        return matchesPrice && matchesCategory && matchesSubcategory && matchesColor
      }).length
    } catch (err) {
      console.error('Error counting filtered products:', err)
      return 0
    }
  }

  // Обновляем функцию получения подкатегорий
  const getFilteredSubcategories = () => {
    if (tempFilters.selectedCategories.length === 0) return []

    return Array.from(new Set(
      products
        .filter(product => tempFilters.selectedCategories.includes(product.category.code))
        .map(product => product.subcategory?.code)
        .filter((code): code is string => code !== undefined)
    ))
  }

  // Обновляем функцию получения отфильтрованных уникальных значений
  const getFilteredUniqueValues = (field: 'color') => {
    let filteredProducts = products

    // Фильтруем по выбранным категориям
    if (tempFilters.selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        tempFilters.selectedCategories.includes(product.category.code)
      )
    }

    // Фильтруем по выбранной подкатегории
    if (tempFilters.selectedSubcategories.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        tempFilters.selectedSubcategories.includes(product.subcategory?.code || '')
      )
    }

    // Получаем уникальные значения для выбранного поля
    return Array.from(new Set(filteredProducts.map(product => product[field])))
  }

  // Получаем отфильтрованные уникальные значения для каждого поля
  const filteredUniqueColors = getFilteredUniqueValues('color')

  const filteredUniqueSubcategories = getFilteredSubcategories()

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>
  }

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  return (
    <div className={styles.container}>
      <Breadcrumbs items={[
        { name: 'Главная', path: '/' },
        { name: 'Каталог', path: '/catalog' },
        ...(categoryParam ? [{ 
          name: products.find(p => p.category.code === categoryParam)?.category.name || '', 
          path: `/catalog/${categoryParam}` 
        }] : []),
        ...(subcategoryParam ? [{ 
          name: products.find(p => p.subcategory?.code === subcategoryParam)?.subcategory?.name || '', 
          path: `/catalog/${categoryParam}/${subcategoryParam}` 
        }] : [])
      ].filter((item, index, self) => 
        // Удаляем дубликаты по path и пустые имена
        item.name && 
        index === self.findIndex(t => t.path === item.path)
      )} />
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
                        checked={tempFilters.selectedCategories.includes(categoryCode)}
                        onChange={() => handleCategoryChange(categoryCode)}
                      />
                      {category?.name}
                    </label>
                  )
                })}
              </div>
            </div>

            {tempFilters.selectedCategories.length > 0 && filteredUniqueSubcategories.length > 0 && (
              <div className={styles.filterSection}>
                <h3>Подкатегория</h3>
                <div className={styles.categoryFilters}>
                  {filteredUniqueSubcategories.map(subcategoryCode => {
                    const subcategory = products.find(p => p.subcategory?.code === subcategoryCode)?.subcategory
                    return (
                      <label key={subcategoryCode} className={styles.categoryLabel}>
                        <input
                          type="checkbox"
                          checked={tempFilters.selectedSubcategories.includes(subcategoryCode)}
                          onChange={() => handleSubcategoryChange(subcategoryCode)}
                        />
                        {subcategory?.name}
                      </label>
                    )
                  })}
                </div>
              </div>
            )}

            <div className={styles.filterSection}>
              <h3>Цена</h3>
              <div className={styles.priceInputs}>
                <input
                  type="number"
                  value={tempFilters.priceRange.min}
                  onChange={(e) => setTempFilters(prev => ({ 
                    ...prev, 
                    priceRange: { ...prev.priceRange, min: Number(e.target.value) }
                  }))}
                  placeholder="От"
                />
                <input
                  type="number"
                  value={tempFilters.priceRange.max}
                  onChange={(e) => setTempFilters(prev => ({ 
                    ...prev, 
                    priceRange: { ...prev.priceRange, max: Number(e.target.value) }
                  }))}
                  placeholder="До"
                />
              </div>
            </div>

            <div className={styles.filterSection}>
              <h3>Цвет</h3>
              <div className={styles.categoryFilters}>
                {filteredUniqueColors.map(color => (
                  <label key={color} className={styles.categoryLabel}>
                    <input
                      type="checkbox"
                      checked={tempFilters.selectedColors.includes(color)}
                      onChange={() => handleMultiSelectChange(color, 'selectedColors')}
                    />
                    {color}
                  </label>
                ))}
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