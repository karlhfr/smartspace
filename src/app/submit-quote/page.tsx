'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function SubmitQuote() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_address: '',
    stair_width: '',
    height_of_4_steps: '',
    length_of_4_steps: '',
    tread_depth: '',
    riser_height: '',
    install_price: '',
    additional_notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('You must be logged in to submit a quote.');
        return;
      }

      const quoteData = {
        ...formData,
        fitter_id: uid,
        quote_date: new Date(),
      };

      const docRef = await addDoc(collection(db, 'Quotes'), quoteData);
      alert('Quote submitted successfully!');
      router.push('/fitter-dashboard');
    } catch (error) {
      console.error('Error submitting quote:', error);
      alert('Failed to submit quote. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-5">
      <h1 className="text-2xl font-bold mb-5">Submit a Quote</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700">Customer Name</label>
          <input type="text" id="customer_name" name="customer_name" required
                 value={formData.customer_name} onChange={handleChange}
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label htmlFor="customer_address" className="block text-sm font-medium text-gray-700">Customer Address</label>
          <input type="text" id="customer_address" name="customer_address" required
                 value={formData.customer_address} onChange={handleChange}
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label htmlFor="stair_width" className="block text-sm font-medium text-gray-700">Stair Width (cm)</label>
          <input type="number" id="stair_width" name="stair_width" required
                 value={formData.stair_width} onChange={handleChange}
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label htmlFor="height_of_4_steps" className="block text-sm font-medium text-gray-700">Height of 4 Steps (cm)</label>
          <input type="number" id="height_of_4_steps" name="height_of_4_steps" required
                 value={formData.height_of_4_steps} onChange={handleChange}
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label htmlFor="length_of_4_steps" className="block text-sm font-medium text-gray-700">Length of 4 Steps (cm)</label>
          <input type="number" id="length_of_4_steps" name="length_of_4_steps" required
                 value={formData.length_of_4_steps} onChange={handleChange}
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label htmlFor="tread_depth" className="block text-sm font-medium text-gray-700">Tread Depth (cm)</label>
          <input type="number" id="tread_depth" name="tread_depth" required
                 value={formData.tread_depth} onChange={handleChange}
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label htmlFor="riser_height" className="block text-sm font-medium text-gray-700">Riser Height (cm)</label>
          <input type="number" id="riser_height" name="riser_height" required
                 value={formData.riser_height} onChange={handleChange}
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label htmlFor="install_price" className="block text-sm font-medium text-gray-700">Installation Price (£)</label>
          <input type="number" id="install_price" name="install_price" required
                 value={formData.install_price} onChange={handleChange}
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label htmlFor="additional_notes" className="block text-sm font-medium text-gray-700">Additional Notes</label>
          <textarea id="additional_notes" name="additional_notes" rows={3}
                    value={formData.additional_notes} onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
        </div>
        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Submit Quote
        </button>
      </form>
    </div>
  );
}