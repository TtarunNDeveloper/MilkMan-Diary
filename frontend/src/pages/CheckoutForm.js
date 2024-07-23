import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const CheckoutForm = ({ invoiceData, cartData }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const { clientSecret } = await fetch('http://localhost:8080/api/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: cartData.reduce((acc, item) => acc + item.quantity * item.productId.sellingPrice, 0) * 100 })
        }).then(res => res.json());

        const cardElement = elements.getElement(CardElement);

        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: invoiceData.name,
                    email: invoiceData.email,
                    address: {
                        line1: invoiceData.addressLine1,
                        line2: invoiceData.addressLine2,
                        city: invoiceData.city,
                        state: invoiceData.state,
                        country: invoiceData.country
                    }
                }
            }
        });

        if (error) {
            setErrorMessage(error.message);
            setLoading(false);
            return;
        }

        setSuccess(true);
        setLoading(false);

        await fetch('http://localhost:8080/api/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                invoiceNumber: invoiceData.invoiceNumber,
                name: invoiceData.name,
                contactNo: invoiceData.phoneNo,
                emailId: invoiceData.email,
                address: `${invoiceData.addressLine1}, ${invoiceData.addressLine2}, ${invoiceData.city}, ${invoiceData.state}, ${invoiceData.country}`,
                products: cartData.map(item => ({
                    productId: item.productId._id,
                    quantity: item.quantity,
                })),
                paymentStatus: 'Paid',
            }),
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe || loading}>
                {loading ? 'Processing...' : 'Pay'}
            </button>
            {errorMessage && <div>{errorMessage}</div>}
            {success && <div>Payment Successful!</div>}
        </form>
    );
};

export default CheckoutForm;
