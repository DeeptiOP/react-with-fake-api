import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ProductPage(){
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    let mounted = true;
    async function fetchProduct(){
      setLoading(true);
      try{
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        if(!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        if(mounted) setProduct(data);
      }catch(err){
        if(mounted) setError(err.message || 'Error');
      }finally{ if(mounted) setLoading(false); }
    }
    fetchProduct();
    return ()=>{ mounted = false; };
  },[id]);

  if(loading) return <div className="max-w-4xl mx-auto px-4 py-12">Loading product...</div>;
  if(error) return <div className="max-w-4xl mx-auto px-4 py-12 text-red-500">{error}</div>;
  if(!product) return <div className="max-w-4xl mx-auto px-4 py-12">Product not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <img src={product.image} alt={product.title} className="w-full md:w-1/3 object-contain" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <div className="text-indigo-600 font-bold text-xl mb-4">${product.price}</div>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded">Add to cart</button>
        </div>
      </div>
    </div>
  );
}
