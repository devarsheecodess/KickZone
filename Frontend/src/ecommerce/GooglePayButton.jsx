import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GooglePayButton = () => {
  const [googlePayAvailable, setGooglePayAvailable] = useState(false);

  useEffect(() => {
    const paymentsClient = new window.google.payments.api.PaymentsClient({ environment: 'TEST' });

    paymentsClient.isReadyToPay({
      allowedPaymentMethods: [
        {
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['VISA', 'MASTERCARD']
          }
        }
      ]
    }).then((response) => {
      setGooglePayAvailable(response.result);
    }).catch((err) => console.error(err));
  }, []);

  const loadPaymentData = () => {
    const paymentsClient = new window.google.payments.api.PaymentsClient({ environment: 'TEST' });

    const paymentDataRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      merchantInfo: {
        merchantId: 'BCR2DN4TUPEZZHRZ',
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
              gateway: 'example',  // Use your payment gateway or 'example' for Test Mode
              gatewayMerchantId: 'BCR2DN4TUPEZZHRZ'
            }
          }
        }
      ]
    };

    paymentsClient.loadPaymentData(paymentDataRequest)
      .then((paymentData) => {
        handlePaymentSuccess(paymentData);
      })
      .catch((err) => console.error('loadPaymentData error:', err));
  };

  const handlePaymentSuccess = (paymentData) => {
    // Send payment data to your backend
    axios.post('/api/process-payment', { paymentData })
      .then(response => {
        alert('Payment successful!');
      })
      .catch(error => {
        console.error('Payment processing error:', error);
      });
  };

  return (
    <div>
      {googlePayAvailable ? (
        <button onClick={loadPaymentData}>Pay with Google Pay</button>
      ) : (
        <p>Google Pay is not available</p>
      )}
    </div>
  );
};

export default GooglePayButton;
