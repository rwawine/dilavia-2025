import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
        const response = await fetch('/data/data.json')
        const data = await response.json()
        setMaterials(data[0].materials)
      } catch (err) {
        setError('Ошибка при загрузке тканей')
        console.error('Error fetching materials:', err)
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

  return (
    <div className={styles.container}>
      <Breadcrumbs items={[
        { name: 'Ткани', path: '/fabric' },
      ]} />
      <h1 className={styles.title}>Ткани</h1>
      <p className={styles.description}>
        Все ткани предоставляются бесплатно при заказе мебели
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
                  src={`/${material.collections[0].variants[0].image}`} 
                  alt={material.nameLoc} 
                />
              )}
            </div>
            <h2 className={styles.materialName}>{material.nameLoc}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}
