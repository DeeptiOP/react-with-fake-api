import React from 'react';

export default function ShippingPage(){
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Shipping Information</h1>
      <p className="text-gray-600 mb-4">We offer fast and reliable shipping across supported regions. Orders typically ship within 1-2 business days.</p>
      <ul className="list-disc pl-5 text-gray-600">
        <li>Standard Shipping: 3–7 business days</li>
        <li>Express Shipping: 1–3 business days</li>
        <li>Free shipping on orders over $75</li>
      </ul>
    </div>
  );
}
