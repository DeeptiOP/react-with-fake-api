import React from 'react';

export default function FAQPage(){
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Frequently Asked Questions</h1>
      <div className="space-y-4 text-gray-600">
        <div>
          <h3 className="font-semibold">How long does shipping take?</h3>
          <p>Standard shipping takes 3–7 business days. Express shipping is 1–3 business days.</p>
        </div>
        <div>
          <h3 className="font-semibold">What is your return policy?</h3>
          <p>Most items can be returned within 30 days for a full refund. See Returns page for details.</p>
        </div>
      </div>
    </div>
  );
}
