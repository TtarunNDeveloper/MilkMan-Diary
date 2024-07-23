import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import displayINRCurrency from '../helpers/displayCurrency';
import logo from '../assets/logo.png';
import qrCodeImage from '../assets/qrcode.jpg'; // Add your QR code image here

const Checkout = () => {
    const { invoiceNumber } = useParams();
    const [invoiceData, setInvoiceData] = useState(null);
    const [cartData, setCartData] = useState([]);
    const [showUPIPayment, setShowUPIPayment] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [invoiceResponse, cartResponse] = await Promise.all([
                    fetch(`http://localhost:8080/api/invoice/${invoiceNumber}`),
                    fetch('http://localhost:8080/api/addtocart')
                ]);

                const invoiceResult = await invoiceResponse.json();
                const cartResult = await cartResponse.json();

                if (invoiceResult.success) {
                    setInvoiceData(invoiceResult.data);
                } else {
                    alert('Error fetching invoice: ' + invoiceResult.message);
                }

                if (cartResult.success) {
                    setCartData(cartResult.data);
                } else {
                    alert('Error fetching cart: ' + cartResult.message);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Error fetching data: ' + error.message);
            }
        };

        fetchData();
    }, [invoiceNumber]);

    if (!invoiceData) {
        return <div>Loading...</div>;
    }

    const totalQty = cartData.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0);
    const totalPrice = cartData.reduce((previousValue, currentValue) => previousValue + (currentValue.quantity * currentValue.productId.sellingPrice), 0);

    const handleShare = () => {
        const upiLink = `upi://pay?pa=YOUR_UPI_ID&pn=YOUR_NAME&am=${totalPrice}&cu=INR`;
        window.location.href = upiLink;
    };

    const handleDone = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    invoiceNumber: invoiceData.invoiceNumber,
                    name: invoiceData.name,
                    contactNo: invoiceData.phoneNo,
                    emailId: invoiceData.email,
                    address: `${invoiceData.addressLine1}, ${invoiceData.addressLine2}, ${invoiceData.city}, ${invoiceData.state}, ${invoiceData.country}`,
                    products: cartData.map(item => ({
                        productId: item.productId._id,
                        productName: item.productId.productName,
                        quantity: item.quantity,
                        price: item.productId.sellingPrice,
                        imageUrl: item.productId.productImage[0]
                    })),
                    totalQty,
                    totalPrice,
                    paymentStatus: 'Reviewing'
                })
            });

            const result = await response.json();
            if (result.success) {
                alert('Order placed successfully');
                navigate('/order-confirmation');
            } else {
                alert('Error placing order: ' + result.message);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Error placing order: ' + error.message);
        }
    };

    return (
        <div className='container mx-auto px-10 py-5'>
            <div className="invoice">
                <div className="invoice-header flex justify-between items-center mb-4">
                    <div>
                        <h1 className='font-bold text-2xl'>Bill</h1>
                        <p className='font-bold'>Invoice Number: {invoiceData.invoiceNumber}</p>
                    </div>
                    <div className='text-right'>
                        <img src={logo} alt="Company Logo" className='mb-2' />
                        <p className='address'>Samasthipura, Bihar</p>
                    </div>
                </div>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
                    <div>
                        <h2 className='text-xl font-semibold mb-2'>Billing Details</h2>
                        <p><strong>Name:</strong> {invoiceData.name}</p>
                        <p><strong>Email:</strong> {invoiceData.email}</p>
                        <p><strong>Address:</strong> {invoiceData.addressLine1}, {invoiceData.addressLine2}, {invoiceData.city}, {invoiceData.state}, {invoiceData.country}</p>
                        <p><strong>Phone:</strong> {invoiceData.phoneNo}</p>
                    </div>
                    <div>
                        <h2 className='text-xl font-semibold mb-2'>Order Summary</h2>
                        <div className='flex flex-col'>
                            {cartData.map((item, index) => (
                                <div key={index} className='flex justify-between items-center border-b py-2'>
                                    <div>
                                        <h3 className='text-lg'>{item.productId.productName}</h3>
                                        <p>{displayINRCurrency(item.productId.sellingPrice)} x {item.quantity}</p>
                                    </div>
                                    <p>{displayINRCurrency(item.productId.sellingPrice * item.quantity)}</p>
                                </div>
                            ))}
                            <div className='flex justify-between items-center border-t py-2 mt-4'>
                                <p><strong>Total Qty:</strong> {totalQty}</p>
                                <p><strong>Total Price:</strong> {displayINRCurrency(totalPrice)}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex justify-between items-center mt-4'>
                    <button
                        className='bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded flex items-center'
                        onClick={() => setShowUPIPayment(true)}
                    >
                        Payment Using UPI
                    </button>
                </div>
                {showUPIPayment && (
                    <div className='mt-4'>
                        <div className='flex justify-between items-center'>
                            <p><strong>Total Amount:</strong> {displayINRCurrency(totalPrice)}</p>
                            <div>
                                <button onClick={handleShare} className='bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mr-2'>Share</button>
                                <button onClick={() => setShowUPIPayment(false)} className='bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded'>Exit</button>
                            </div>
                        </div>
                        <div className='flex justify-center mt-4'>
                            <img src={qrCodeImage} alt="QR Code" className='w-48 h-48' />
                        </div>
                        <div className='flex justify-center mt-4'>
                            <button onClick={handleDone} className='bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded'>Done</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Checkout;
