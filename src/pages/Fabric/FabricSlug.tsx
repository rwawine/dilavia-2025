import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ProductDetail from '../ProductDetail/ProductDetail'

export default function FabricSlug() {
  const { slug } = useParams()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkIfFabric = async () => {
      if (!slug) {
        setIsLoading(false)
        return
      }

      try {
        const parts = slug.split('-')
        
        if (parts.length < 2) {
          // Если в slug нет дефиса, это точно не ткань
          setIsLoading(false)
          return
        }
        
        // Если мы здесь, значит это не ткань
        setIsLoading(false)
      } catch (err) {
        console.error('Error checking if slug is fabric:', err)
        setIsLoading(false)
      }
    }

    checkIfFabric()
  }, [slug])

  if (isLoading) {
    return <div>Проверка данных...</div>
  }
  
  // Если это не ткань, отображаем обычный ProductDetail
  return <ProductDetail />
} 