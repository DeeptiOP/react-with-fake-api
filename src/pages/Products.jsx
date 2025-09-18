import React, { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'

export default function Products(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to load products.')
        setLoading(false)
      })
  }, [])

  if(loading) return <div className="text-center text-gray-600">Loading products...</div>
  if(error) return <div className="text-center text-red-600">{error}</div>

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Products</h1>
      <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}
