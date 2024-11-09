import React from 'react';
import GooglePayButton from '@google-pay/button-react';
import axios from 'axios';

const GooglePayComponent = () => {
  const paymentRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
    merchantInfo: {
      merchantId: process.env.REACT_APP_GOOGLE_PAY_MERCHANT_ID, // Use the environment variable
      merchantName: 'Demo Merchant'
    },
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPrice: '1.00',
      currencyCode: 'INR'
    },
    allowedPaymentMethods: [
      {
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['VISA', 'MASTERCARD']
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
            gateway: 'example', // Replace with your payment gateway
            gatewayMerchantId: process.env.REACT_APP_GOOGLE_PAY_MERCHANT_ID // Use the environment variable
          }
        }
      }
    ]
  };

  const handleLoadPaymentData = (paymentData) => {
    axios.post('/api/process-payment', { paymentData })
      .then(response => {
        alert('Payment successful!');
        const userId = localStorage.getItem('id');
        
        // Logic to create an order can be added here
        const orderData = {
          id: response.data.orderId, // Assuming your backend returns an order ID
          userId,
          productId: response.data.productId, // Adjust based on your API response
          date: new Date().toISOString() // Current date as ISO string
        };

        return axios.post('/orders', orderData);
      })
      .then(orderResponse => {
        alert('Order created successfully!');
        console.log('Order details:', orderResponse.data);
      })
      .catch(error => {
        console.error('Error processing payment or creating order:', error);
        alert('An error occurred while processing your request. Please try again.');
      });
  };

  return (
    <div>
      <GooglePayButton
        environment="TEST" // Change to "PRODUCTION" for live transactions
        buttonColor="black"
        buttonType="buy"
        paymentRequest={paymentRequest}
        onLoadPaymentData={handleLoadPaymentData}
        onError={(error) => console.error('Google Pay Error:', error)}
      />
    </div>
  );
};

export default GooglePayComponent;