import React from 'react';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
      <p className="text-gray-600 mb-6">Have questions? We're here to help — send us a message and we'll respond within 1 business day.</p>

      <form className="grid grid-cols-1 gap-4 max-w-xl">
        <input className="border px-3 py-2 rounded" placeholder="Your name" />
        <input className="border px-3 py-2 rounded" placeholder="Your email" />
        <textarea className="border px-3 py-2 rounded" rows={6} placeholder="Your message" />
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Send Message</button>
      </form>
    </div>
  );
}
