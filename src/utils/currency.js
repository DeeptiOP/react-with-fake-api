export function formatINR(amount){
  try{
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount)
  }catch(e){
    return `₹${Number(amount || 0).toFixed(2)}`
  }
}


