import React, { useState } from 'react';

export default function TrackOrderPage(){
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState(null);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!orderId) return;
    // Placeholder: in production this would call backend tracking API
    setStatus(`No live tracking available. Order ID: ${orderId} — please check your email for updates.`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Track Your Order</h1>
      <form onSubmit={handleTrack} className="flex gap-2">
        <input value={orderId} onChange={(e)=>setOrderId(e.target.value)} placeholder="Enter your order ID" className="flex-1 border px-3 py-2 rounded" />
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Track</button>
      </form>
      {status && <div className="mt-4 text-gray-600">{status}</div>}
    </div>
  );
}
