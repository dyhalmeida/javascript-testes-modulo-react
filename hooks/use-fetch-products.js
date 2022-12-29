import { useEffect, useState } from "react"
import axios from "axios"

export const useFetchProducts = () => {
  const [products, setProducts] = useState([])
  const [error, setError] = useState(false)

  useEffect(() => {
    let isMounted = true
    axios
      .get('/api/products')
      .then(response => {
        if (isMounted) {
          setProducts(response.data.products)
        }
      })
      .catch(e => {
        if (isMounted) {
          setError(true)
        }
      })
    return () => {
      isMounted = false
    }
  }, [])

  return { products, error }
}