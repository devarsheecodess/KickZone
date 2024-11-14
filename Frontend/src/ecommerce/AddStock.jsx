import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Camera, Package, Tag, Calendar, ShoppingBag, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

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
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      reader.onload = () => {
        setImagePreview(reader.result);
        res(reader.result);
      }
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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
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
      date: isTicketSelected ? prevProduct.date : '',
    }));
  };

  const resetForm = () => {
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
    setIsTicket(false);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${BACKEND_URL}/products`, product);
      if (response.status === 201) {
        setSuccess(`${isTicket ? 'Ticket' : 'Product'} added successfully!`);
        resetForm();
      }
    } catch (err) {
      setError(`Error adding ${isTicket ? 'ticket' : 'product'}. Please try again.`);
      console.log('Error', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="fixed top-0 left-0 w-full h-full z-[-2] bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Add New {isTicket ? 'Ticket' : 'Product'}</h2>
          <p className="text-gray-600">Add your {isTicket ? 'match tickets' : 'merchandise'} to the inventory</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border-l-4 border-red-500">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-4 bg-green-50 border-l-4 border-green-500">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="text-green-700">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8">
            <fieldset disabled={isLoading} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isTicket ? 'Ticket' : 'Product'} Name
                    </label>
                    <div className="relative">
                      <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        placeholder={`Enter ${isTicket ? 'ticket' : 'product'} name`}
                        className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹)
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        placeholder="Enter price"
                        className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <div className="relative">
                      <ShoppingBag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        name="qty"
                        value={product.qty}
                        onChange={handleChange}
                        placeholder="Enter quantity"
                        className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      name="isTicket"
                      onChange={handleTicketChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="product">Merchandise</option>
                      <option value="ticket">Match Ticket</option>
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isTicket ? 'Ticket' : 'Product'} Image
                    </label>
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
                        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                        id="image-upload"
                        required
                        disabled={isLoading}
                      />
                      <label
                        htmlFor="image-upload"
                        className={`cursor-pointer flex flex-col items-center justify-center gap-2 ${
                          isLoading ? 'cursor-not-allowed' : ''
                        }`}
                      >
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        ) : (
                          <>
                            <Camera className="w-12 h-12 text-gray-400" />
                            <p className="text-sm text-gray-600">
                              Drag and drop or click to upload
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="desc"
                      value={product.desc}
                      onChange={handleChange}
                      placeholder={`Enter ${isTicket ? 'ticket' : 'product'} description`}
                      rows="4"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      required
                    />
                  </div>
                </div>
              </div>

              {isTicket && (
                <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Match Details</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Match Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={product.date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Adding {isTicket ? 'Ticket' : 'Product'}...</span>
                    </>
                  ) : (
                    <>
                      <Package className="w-5 h-5" />
                      <span>Add {isTicket ? 'Ticket' : 'Product'}</span>
                    </>
                  )}
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStock;