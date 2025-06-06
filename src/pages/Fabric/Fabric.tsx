import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SEO } from '../../components/SEO/SEO'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'
import styles from './Fabric.module.css'

interface Material {
  name: string
  nameLoc: string
  collections: Array<{
    name: string
    nameLoc: string
    type: string
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

export default function Fabric() {
  const navigate = useNavigate()
  const [materials, setMaterials] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('/data/data.json')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        if (!data || !Array.isArray(data) || !data[0]?.materials) {
          throw new Error('Invalid data format')
        }

        // Проверяем структуру данных
        const materialsData = data[0].materials
        if (!Array.isArray(materialsData)) {
          throw new Error('Materials data is not an array')
        }

        // Проверяем наличие необходимых полей
        const validMaterials = materialsData.filter(material => {
          return (
            material.name &&
            material.nameLoc &&
            Array.isArray(material.collections) &&
            material.collections.length > 0 &&
            material.collections[0].variants &&
            Array.isArray(material.collections[0].variants) &&
            material.collections[0].variants.length > 0
          )
        })

        if (validMaterials.length === 0) {
          throw new Error('No valid materials found')
        }

        setMaterials(validMaterials)
      } catch (err) {
        console.error('Error fetching materials:', err)
        setError('Ошибка при загрузке тканей. Пожалуйста, попробуйте позже.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMaterials()
  }, [])

  const handleMaterialClick = (materialName: string) => {
    navigate(`/fabric/${materialName}`)
  }

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>
  }

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  if (!materials || materials.length === 0) {
    return <div className={styles.error}>Ткани не найдены</div>
  }

  return (
    <>
      <SEO
        title="Ткани для мебели | DILAVIA - Интернет-магазин мебели"
        description="Широкий выбор качественных тканей для мебели. Бесплатная ткань при заказе мебели. Натуральные и синтетические ткани различных цветов и фактур. Доставка по всей Беларуси."
        keywords="ткани для мебели, обивка для мебели, мебельные ткани, выбор ткани, DILAVIA, бесплатная ткань, натуральные ткани, синтетические ткани"
      />
      <div className={styles.container}>
        <Breadcrumbs items={[
          { name: 'Главная', path: '/' },
          { name: 'Ткани', path: '/fabric' },
        ]} />
        <h1 className={styles.title}>Ткани</h1>
        <p className={styles.description}>
          Все ткани для осмотра предоставляются бесплатно
        </p>
        
        <div className={styles.materialsGrid}>
          {materials.map((material) => (
            <div 
              key={material.name} 
              className={styles.materialCard}
              onClick={() => handleMaterialClick(material.name)}
            >
              <div className={styles.materialImage}>
                {material.collections[0]?.variants[0]?.image && (
                  <img 
                    src={material.collections[0].variants[0].image.startsWith('/') 
                      ? material.collections[0].variants[0].image 
                      : `/${material.collections[0].variants[0].image}`} 
                    alt={material.nameLoc}
                  />
                )}
              </div>
              <h2 className={styles.materialName}>{material.nameLoc}</h2>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
