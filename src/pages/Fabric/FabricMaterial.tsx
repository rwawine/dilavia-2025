import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SEO } from '../../components/SEO/SEO'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'
import { Filter, X } from 'lucide-react'
import styles from './FabricMaterial.module.css'

interface Filter {
  origin: string
  abrasionResistance: {
    min: string
    max: string
  }
}

interface UniqueFilters {
  origins: string[]
  abrasionResistance: {
    min: number
    max: number
  }
}

interface Material {
  name: string
  nameLoc: string
  collections: Array<{
    name: string
    nameLoc: string
    type: string
    technicalSpecifications: {
      abrasionResistance: string
      origin: string
      originLoc: string
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
  const [filters, setFilters] = useState<Filter>({
    origin: '',
    abrasionResistance: {
      min: '',
      max: ''
    }
  })
  const [tempFilters, setTempFilters] = useState<Filter>({
    origin: '',
    abrasionResistance: {
      min: '',
      max: ''
    }
  })
  const [uniqueFilters, setUniqueFilters] = useState<UniqueFilters>({
    origins: [],
    abrasionResistance: {
      min: 0,
      max: 0
    }
  })
  const [filteredCount, setFilteredCount] = useState(0)

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
        const origins = new Set<string>()
        const abrasionValues: number[] = []
        
        foundMaterial.collections.forEach((collection: Material['collections'][0]) => {
          if (collection.technicalSpecifications) {
            if (collection.technicalSpecifications.origin) {
              origins.add(collection.technicalSpecifications.origin)
            }
            if (collection.technicalSpecifications.abrasionResistance) {
              const value = parseInt(collection.technicalSpecifications.abrasionResistance)
              if (!isNaN(value)) {
                abrasionValues.push(value)
              }
            }
          }
        })
        
        const minAbrasion = abrasionValues.length > 0 ? Math.min(...abrasionValues) : 0
        const maxAbrasion = abrasionValues.length > 0 ? Math.max(...abrasionValues) : 0
        
        setUniqueFilters({
          origins: Array.from(origins).sort(),
          abrasionResistance: {
            min: minAbrasion,
            max: maxAbrasion
          }
        })

        // Устанавливаем начальные значения фильтров
        setTempFilters(prev => ({
          ...prev,
          abrasionResistance: {
            min: minAbrasion.toString(),
            max: maxAbrasion.toString()
          }
        }))
        setFilters(prev => ({
          ...prev,
          abrasionResistance: {
            min: minAbrasion.toString(),
            max: maxAbrasion.toString()
          }
        }))
      } catch (err) {
        setError('Ошибка при загрузке материала')
        console.error('Error fetching material:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMaterial()
  }, [materialName])

  useEffect(() => {
    if (!material) return

    // Подсчет отфильтрованных тканей
    const count = material.collections.filter(collection => {
      if (!collection.technicalSpecifications) return true

      const matchesOrigin = !tempFilters.origin || 
        collection.technicalSpecifications.origin === tempFilters.origin
      
      const abrasionValue = parseInt(collection.technicalSpecifications.abrasionResistance)
      if (isNaN(abrasionValue)) return matchesOrigin

      const minValue = tempFilters.abrasionResistance.min ? 
        parseInt(tempFilters.abrasionResistance.min) : 
        uniqueFilters.abrasionResistance.min
      
      const maxValue = tempFilters.abrasionResistance.max ? 
        parseInt(tempFilters.abrasionResistance.max) : 
        uniqueFilters.abrasionResistance.max
      
      const matchesAbrasion = abrasionValue >= minValue && abrasionValue <= maxValue
      
      return matchesOrigin && matchesAbrasion
    }).length

    setFilteredCount(count)
  }, [material, tempFilters, uniqueFilters])

  const handleCollectionClick = (collectionName: string) => {
    navigate(`/fabric/${materialName}/${collectionName}`)
  }
  
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
    if (!isFilterOpen) {
      setTempFilters(filters)
    }
  }
  
  const handleFilterChange = (key: keyof Filter, value: string) => {
    if (key === 'origin') {
      setTempFilters(prev => ({
        ...prev,
        [key]: prev[key] === value ? '' : value
      }))
    }
  }

  const handleAbrasionChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value)
    if (isNaN(numValue) && value !== '') return

    setTempFilters(prev => ({
      ...prev,
      abrasionResistance: {
        ...prev.abrasionResistance,
        [type]: value
      }
    }))
  }
  
  const applyFilters = () => {
    setFilters(tempFilters)
    setIsFilterOpen(false)
  }
  
  const resetFilters = () => {
    const emptyFilters = {
      origin: '',
      abrasionResistance: {
        min: uniqueFilters.abrasionResistance.min.toString(),
        max: uniqueFilters.abrasionResistance.max.toString()
      }
    }
    setTempFilters(emptyFilters)
    setFilters(emptyFilters)
  }
  
  const resetSection = (section: keyof Filter) => {
    if (section === 'origin') {
      setTempFilters(prev => ({
        ...prev,
        origin: ''
      }))
    } else if (section === 'abrasionResistance') {
      setTempFilters(prev => ({
        ...prev,
        abrasionResistance: {
          min: uniqueFilters.abrasionResistance.min.toString(),
          max: uniqueFilters.abrasionResistance.max.toString()
        }
      }))
    }
  }
  
  const filteredCollections = material?.collections.filter(collection => {
    if (!collection.technicalSpecifications) return true
    
    const matchesOrigin = !filters.origin || 
      collection.technicalSpecifications.origin === filters.origin
    
    const abrasionValue = parseInt(collection.technicalSpecifications.abrasionResistance)
    if (isNaN(abrasionValue)) return matchesOrigin

    const minValue = filters.abrasionResistance.min ? 
      parseInt(filters.abrasionResistance.min) : 
      uniqueFilters.abrasionResistance.min
    
    const maxValue = filters.abrasionResistance.max ? 
      parseInt(filters.abrasionResistance.max) : 
      uniqueFilters.abrasionResistance.max
    
    const matchesAbrasion = abrasionValue >= minValue && abrasionValue <= maxValue
    
    return matchesOrigin && matchesAbrasion
  })

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>
  }

  if (error || !material) {
    return <div className={styles.error}>{error || 'Материал не найден'}</div>
  }

  return (
    <>
      <SEO
        title={`${material.nameLoc} - Ткани для мебели | DILAVIA`}
        description={`Коллекции тканей ${material.nameLoc} от DILAVIA. Широкий выбор цветов и фактур.`}
        keywords={`${material.nameLoc}, ткани для мебели, обивка для мебели, мебельные ткани, выбор ткани, DILAVIA`}
      />
      <div className={styles.container}>
        <Breadcrumbs items={[
          { name: 'Ткани', path: '/fabric' },
          { name: material.nameLoc, path: `/fabric/${material.name}` }
        ]} />
        
        <div className={styles.header}>
          <h1 className={styles.title}>{material.nameLoc}</h1>
          <button className={styles.filterButton} onClick={toggleFilter}>
            Фильтры
            {Object.values(filters).some(Boolean) && (
              <span className={styles.filterBadge}>
                {Object.values(filters).filter(Boolean).length}
              </span>
            )}
          </button>
        </div>
        
        <div className={`${styles.filterDrawer} ${isFilterOpen ? styles.open : ''}`}>
          <div className={styles.filterHeader}>
            <h3 className={styles.filterTitle}>Фильтры</h3>
            <button className={styles.closeButton} onClick={toggleFilter}>
              <X size={20} />
            </button>
          </div>
          
          <div className={styles.filterContent}>
            {uniqueFilters.origins.length > 0 && (
              <div className={styles.filterSection}>
                <div className={styles.filterSectionTitle}>
                  <span>Страна</span>
                </div>
                <div className={styles.filterOptions}>
                  {uniqueFilters.origins.map(origin => (
                    <button 
                      key={origin}
                      className={`${styles.filterOption} ${tempFilters.origin === origin ? styles.active : ''}`}
                      onClick={() => handleFilterChange('origin', origin)}
                    >
                      <span>{origin}</span>
                      {tempFilters.origin === origin && (
                        <span>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className={styles.filterSection}>
              <div className={styles.filterSectionTitle}>
                <span>Износостойкость</span>
                {(tempFilters.abrasionResistance.min !== uniqueFilters.abrasionResistance.min.toString() ||
                  tempFilters.abrasionResistance.max !== uniqueFilters.abrasionResistance.max.toString()) && (
                  <button onClick={() => resetSection('abrasionResistance')}>
                    Сбросить
                  </button>
                )}
              </div>
              <div className={styles.rangeInputs}>
                <div className={styles.rangeInput}>
                  <label>От</label>
                  <input
                    type="number"
                    min={uniqueFilters.abrasionResistance.min}
                    max={uniqueFilters.abrasionResistance.max}
                    value={tempFilters.abrasionResistance.min}
                    onChange={(e) => handleAbrasionChange('min', e.target.value)}
                    placeholder={uniqueFilters.abrasionResistance.min.toString()}
                  />
                </div>
                <div className={styles.rangeInput}>
                  <label>До</label>
                  <input
                    type="number"
                    min={uniqueFilters.abrasionResistance.min}
                    max={uniqueFilters.abrasionResistance.max}
                    value={tempFilters.abrasionResistance.max}
                    onChange={(e) => handleAbrasionChange('max', e.target.value)}
                    placeholder={uniqueFilters.abrasionResistance.max.toString()}
                  />
                </div>
              </div>
              <div className={styles.rangeLabels}>
                <span>{uniqueFilters.abrasionResistance.min} циклов</span>
                <span>{uniqueFilters.abrasionResistance.max} циклов</span>
              </div>
            </div>
          </div>
          
          <div className={styles.filterActions}>
          <button 
              className={styles.applyButton}
              onClick={applyFilters}
              disabled={!Object.values(tempFilters).some(Boolean)}
            >
              Применить 
              {filteredCount > 0 && (
                <span>
                  {filteredCount}
                </span>
              )}
            </button>
            <button className={styles.resetButton} onClick={resetFilters}>
              Сбросить все
            </button>
          </div>
        </div>
        
        <div className={`${styles.overlay} ${isFilterOpen ? styles.visible : ''}`} onClick={toggleFilter}></div>
        
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
    </>
  )
} 