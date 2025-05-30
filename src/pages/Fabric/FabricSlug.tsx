import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProductDetail from '../ProductDetail/ProductDetail'

export default function FabricSlug() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [isFabric, setIsFabric] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkIfFabric = async () => {
      if (!slug) {
        setIsFabric(false)
        setIsLoading(false)
        return
      }

      try {
        // Проверяем, соответствует ли slug формату "Материал-Коллекция"
        const parts = slug.split('-')
        
        if (parts.length < 2) {
          // Если в slug нет дефиса, это точно не ткань
          setIsFabric(false)
          setIsLoading(false)
          return
        }

        const materialName = parts[0]
        const collectionName = parts.slice(1).join('-')
        
        // Проверяем, существует ли такой материал
        const response = await fetch('/data/data.json')
        const data = await response.json()
        
        const foundMaterial = data[0].materials.find(
          (m: any) => m.name === materialName
        )
        
        if (foundMaterial) {
          // Проверяем, существует ли такая коллекция в этом материале
          const foundCollection = foundMaterial.collections.find(
            (c: any) => c.name === collectionName
          )
          
          if (foundCollection) {
            // Это действительно ткань, перенаправляем
            navigate(`/fabric/${materialName}/${collectionName}`, { replace: true })
            return
          }
        }
        
        // Если мы здесь, значит это не ткань
        setIsFabric(false)
        setIsLoading(false)
      } catch (err) {
        console.error('Error checking if slug is fabric:', err)
        setIsFabric(false)
        setIsLoading(false)
      }
    }
    
    checkIfFabric()
  }, [slug, navigate])

  if (isLoading) {
    return <div>Проверка данных...</div>
  }
  
  // Если это не ткань, отображаем обычный ProductDetail
  return <ProductDetail />
} 