import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const AddStock = () => {
  const [product, setProduct] = useState({
    id: uuidv4(),
    name: '',
    image: '',
    desc: '',
    price: '',
    qty: '',
    type: 'merch',
    date: ''
  });
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [isTicket, setIsTicket] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const convertToBase64 = (file) => {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => res(reader.result);
      reader.onerror = (error) => rej(error);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64String = await convertToBase64(file);
      setProduct((prevProduct) => ({
        ...prevProduct,
        image: base64String,
      }));
    }
  };

  const handleTicketChange = (e) => {
    const isTicketSelected = e.target.value === 'ticket';
    setIsTicket(isTicketSelected);
    setProduct((prevProduct) => ({
      ...prevProduct,
      type: isTicketSelected ? 'ticket' : 'merch',
      date: isTicketSelected ? prevProduct.date : '', // Reset date if not a ticket
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(product)
      const response = await axios.post(`${BACKEND_URL}/products`, product);
      if (response.status === 201) {
        setSuccess('Product added successfully!');
        alert("Product added successfully")
        setError('');
        // Reset product state after successful submission
        setProduct({
          id: uuidv4(),
          name: '',
          image: '',
          desc: '',
          price: '',
          qty: '',
          type: 'merch',
          date: ''
        });
        setIsTicket(false); // Reset ticket selection
      }
    } catch (err) {
      setError('Error adding product. Please try again.');
      setSuccess('');
      console.log('Error', err);
    }
  };

  return (
    <div className="relative h-screen w-full">
      <div className="relative p-4 mt-10 max-w-lg mx-auto bg-white rounded shadow-md z-10">
        <h2 className="text-2xl font-bold mb-4">Add Product</h2>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Product Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Product Image</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Product desc</label>
            <textarea
              name="desc"
              value={product.desc}
              onChange={handleChange}
              placeholder="Enter product desc"
              className="w-full p-2 border rounded"
              rows="4"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Product Price (₹)</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="Enter product price"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Product qty</label>
            <input
              type="number"
              name="qty"
              value={product.qty}
              onChange={handleChange}
              placeholder="Enter qty"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Do you want to add tickets for football merch?</label>
            <select
              name="isTicket"
              onChange={handleTicketChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Option</option>
              <option value="product">Add as Product</option>
              <option value="ticket">Add as Ticket</option>
            </select>
          </div>

          {isTicket && (
            <div className="mt-6 p-4 border-t-2">
              <h3 className="font-semibold text-xl mb-2">Ticket Details</h3>
              <div className="mb-4">
                <label className="block font-semibold mb-2">Event Date</label>
                <input
                  type="date"
                  name="date"
                  value={product.date}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded font-semibold hover:bg-blue-600"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStock;