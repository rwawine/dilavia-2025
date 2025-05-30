import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'
import { Filter, X } from 'lucide-react'
import styles from './FabricMaterial.module.css'

interface Material {
  name: string
  nameLoc: string
  collections: Array<{
    name: string
    nameLoc: string
    type: string
    technicalSpecifications: {
      fabricType: string
      abrasionResistance: string
      composition: string
      compositionLoc: string
      origin: string
      originLoc: string
      applicationAreas: string[]
    }
    variants: Array<{
      id: number
      color: {
        code: string
        name: string
      }
      image: string
    }>
  }>
}

export default function FabricMaterial() {
  const { materialName } = useParams()
  const navigate = useNavigate()
  const [material, setMaterial] = useState<Material | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  const [filters, setFilters] = useState({
    fabricType: '',
    origin: '',
    applicationArea: ''
  })
  
  const [uniqueFilters, setUniqueFilters] = useState({
    fabricTypes: [] as string[],
    origins: [] as string[],
    applicationAreas: [] as string[]
  })

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const response = await fetch('/data/data.json')
        const data = await response.json()
        const foundMaterial = data[0].materials.find(
          (m: Material) => m.name === materialName
        )
        
        if (!foundMaterial) {
          throw new Error('Материал не найден')
        }

        setMaterial(foundMaterial)
        
        // Собираем уникальные значения для фильтров
        const fabricTypes = new Set<string>()
        const origins = new Set<string>()
        const applicationAreas = new Set<string>()
        
        foundMaterial.collections.forEach((collection: any) => {
          if (collection.technicalSpecifications) {
            fabricTypes.add(collection.technicalSpecifications.fabricType)
            origins.add(collection.technicalSpecifications.originLoc)
            collection.technicalSpecifications.applicationAreas?.forEach(
              (area: string) => applicationAreas.add(area)
            )
          }
        })
        
        setUniqueFilters({
          fabricTypes: Array.from(fabricTypes),
          origins: Array.from(origins),
          applicationAreas: Array.from(applicationAreas)
        })
      } catch (err) {
        setError('Ошибка при загрузке материала')
        console.error('Error fetching material:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMaterial()
  }, [materialName])

  const handleCollectionClick = (collectionName: string) => {
    navigate(`/fabric/${materialName}/${collectionName}`)
  }
  
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
  }
  
  const handleFilterChange = (filterType: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? '' : value
    }))
  }
  
  const resetFilters = () => {
    setFilters({
      fabricType: '',
      origin: '',
      applicationArea: ''
    })
  }
  
  const filteredCollections = material?.collections.filter(collection => {
    if (!collection.technicalSpecifications) return true
    
    const matchesFabricType = !filters.fabricType || 
      collection.technicalSpecifications.fabricType === filters.fabricType
      
    const matchesOrigin = !filters.origin || 
      collection.technicalSpecifications.originLoc === filters.origin
      
    const matchesApplicationArea = !filters.applicationArea || 
      collection.technicalSpecifications.applicationAreas?.includes(filters.applicationArea)
      
    return matchesFabricType && matchesOrigin && matchesApplicationArea
  })

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>
  }

  if (error || !material) {
    return <div className={styles.error}>{error || 'Материал не найден'}</div>
  }

  return (
    <div className={styles.container}>
      <Breadcrumbs items={[
        { name: 'Ткани', path: '/fabric' },
        { name: material.nameLoc, path: `/fabric/${material.name}` }
      ]} />
      
      <div className={styles.header}>
        <h1 className={styles.title}>{material.nameLoc}</h1>
        <button className={styles.filterButton} onClick={toggleFilter}>
          <Filter size={20} />
          <span>Фильтры</span>
        </button>
      </div>
      
      <div className={`${styles.filterDrawer} ${isFilterOpen ? styles.open : ''}`}>
        <div className={styles.filterHeader}>
          <h3 className={styles.filterTitle}>Фильтры</h3>
          <button className={styles.closeButton} onClick={toggleFilter}>
            <X size={20} />
          </button>
        </div>
        
        {uniqueFilters.fabricTypes.length > 0 && (
          <div className={styles.filterSection}>
            <h4 className={styles.filterSectionTitle}>Тип ткани</h4>
            <div className={styles.filterOptions}>
              {uniqueFilters.fabricTypes.map(type => (
                <button 
                  key={type}
                  className={`${styles.filterOption} ${filters.fabricType === type ? styles.active : ''}`}
                  onClick={() => handleFilterChange('fabricType', type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {uniqueFilters.origins.length > 0 && (
          <div className={styles.filterSection}>
            <h4 className={styles.filterSectionTitle}>Страна</h4>
            <div className={styles.filterOptions}>
              {uniqueFilters.origins.map(origin => (
                <button 
                  key={origin}
                  className={`${styles.filterOption} ${filters.origin === origin ? styles.active : ''}`}
                  onClick={() => handleFilterChange('origin', origin)}
                >
                  {origin}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {uniqueFilters.applicationAreas.length > 0 && (
          <div className={styles.filterSection}>
            <h4 className={styles.filterSectionTitle}>Применение</h4>
            <div className={styles.filterOptions}>
              {uniqueFilters.applicationAreas.map(area => (
                <button 
                  key={area}
                  className={`${styles.filterOption} ${filters.applicationArea === area ? styles.active : ''}`}
                  onClick={() => handleFilterChange('applicationArea', area)}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <button className={styles.resetButton} onClick={resetFilters}>
          Сбросить фильтры
        </button>
      </div>
      
      {isFilterOpen && <div className={styles.overlay} onClick={toggleFilter}></div>}
      
      <div className={styles.collectionsGrid}>
        {filteredCollections?.length === 0 ? (
          <div className={styles.noResults}>
            Нет коллекций, соответствующих выбранным фильтрам
          </div>
        ) : (
          filteredCollections?.map(collection => (
            <div 
              key={collection.name} 
              className={styles.collectionCard}
              onClick={() => handleCollectionClick(collection.name)}
            >
              <div className={styles.collectionImage}>
                {collection.variants[0]?.image && (
                  <img 
                    src={`/${collection.variants[0].image}`} 
                    alt={collection.nameLoc} 
                  />
                )}
              </div>
              <h2 className={styles.collectionName}>{collection.nameLoc}</h2>
            </div>
          ))
        )}
      </div>
    </div>
  )
} 