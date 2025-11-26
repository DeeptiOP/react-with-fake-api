import React from 'react';

export default function ReturnsPage(){
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Returns & Refunds</h1>
      <p className="text-gray-600 mb-4">Not satisfied? You can return most items within 30 days of delivery for a full refund.</p>
      <ol className="list-decimal pl-5 text-gray-600">
        <li>Initiate a return from your account dashboard.</li>
        <li>Pack the items securely and ship to our returns address.</li>
        <li>Refunds are processed within 5–7 business days after receiving the return.</li>
      </ol>
    </div>
  );
}
