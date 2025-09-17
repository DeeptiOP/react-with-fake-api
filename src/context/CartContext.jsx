import React, { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }){
  const [cart, setCart] = useState([]) // {id, title, price, image, quantity}

  function addToCart(product){
    setCart(prev => {
      const exists = prev.find(p => p.id === product.id)
      if(exists){
        // if exists, remove (per requirements: if already in cart display Remove)
        return prev.filter(p => p.id !== product.id)
      } else {
        return [...prev, { ...product, quantity: 1 }]
      }
    })
  }

  function removeFromCart(id){
    setCart(prev => prev.filter(p => p.id !== id))
  }

  function increaseQty(id){
    setCart(prev => prev.map(p => p.id === id ? { ...p, quantity: p.quantity + 1 } : p))
  }

  function decreaseQty(id){
    setCart(prev => prev.map(p => {
      if(p.id === id){
        const q = p.quantity - 1
        return q <= 0 ? null : { ...p, quantity: q }
      }
      return p
    }).filter(Boolean))
  }

  function getCartTotals(){
    const subtotal = cart.reduce((s, it) => s + it.price * it.quantity, 0)
    const discount = subtotal * 0.10
    const total = subtotal - discount
    return { subtotal, discount, total }
  }

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      increaseQty,
      decreaseQty,
      getCartTotals
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(){
  return useContext(CartContext)
}
