import React, { useContext, useEffect, useState } from 'react';
import SummaryApi from '../common';
import { Context } from '../context';
import displayINRCurrency from '../helpers/displayCurrency';
import { MdDelete } from 'react-icons/md';
import Select from 'react-select';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Country, State, City } from 'country-state-city';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [userDetails, setUserDetails] = useState({});
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();
    const context = useContext(Context);
    const loadingCart = new Array(context.cartProductCount).fill(null);

    const countries = Country.getAllCountries().map((country) => ({
        value: country.isoCode,
        label: country.name,
    }));

    const states = selectedCountry ? State.getStatesOfCountry(selectedCountry.value).map((state) => ({
        value: state.isoCode,
        label: state.name,
    })) : [];

    const cities = selectedState ? City.getCitiesOfState(selectedCountry.value, selectedState.value).map((city) => ({
        value: city.name,
        label: city.name,
    })) : [];

    const fetchData = async () => {
        const response = await fetch(SummaryApi.addToCartProductView.url, {
            method: SummaryApi.addToCartProductView.method,
            credentials: 'include',
            headers: {
                'content-type': 'application/json'
            }
        });

        const responseData = await response.json();

        if (responseData.success) {
            setData(responseData.data);
        }
    };

    const fetchUserDetails = async () => {
        const response = await fetch(SummaryApi.current_user.url, {
            method: SummaryApi.current_user.method,
            credentials: 'include',
            headers: {
                'content-type': 'application/json'
            }
        });

        const responseData = await response.json();

        if (responseData.success) {
            setUserDetails(responseData.data);
        }
    };

    const handleLoading = async () => {
        await fetchData();
        await fetchUserDetails();
    };

    useEffect(() => {
        setLoading(true);
        handleLoading();
        setLoading(false);
    }, []);

    const increaseQty = async (id, qty) => {
        const response = await fetch(SummaryApi.updateCartProduct.url, {
            method: SummaryApi.updateCartProduct.method,
            credentials: 'include',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                _id: id,
                quantity: qty + 1
            })
        });

        const responseData = await response.json();

        if (responseData.success) {
            fetchData();
        }
    };

    const decreaseQty = async (id, qty) => {
        if (qty >= 2) {
            const response = await fetch(SummaryApi.updateCartProduct.url, {
                method: SummaryApi.updateCartProduct.method,
                credentials: 'include',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    _id: id,
                    quantity: qty - 1
                })
            });

            const responseData = await response.json();

            if (responseData.success) {
                fetchData();
            }
        }
    };

    const deleteCartProduct = async (id) => {
        const response = await fetch(SummaryApi.deleteCartProduct.url, {
            method: SummaryApi.deleteCartProduct.method,
            credentials: 'include',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                _id: id
            })
        });

        const responseData = await response.json();

        if (responseData.success) {
            fetchData();
            context.fetchUserAddToCart();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            ...Object.fromEntries(formData.entries()),
            country: selectedCountry ? selectedCountry.label : '',
            state: selectedState ? selectedState.label : '',
            city: selectedCity ? selectedCity.label : '',
            phoneNo: phone,
            email: userDetails.email,
        };
    
        try {
            const response = await fetch('http://localhost:8080/api/create-invoice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if(!response.ok){
                throw new Error('HTTP error! status : ${response.status}');
            }
            const result = await response.json();
            if (result.success) {
                setShowForm(false);
                alert('Invoice created successfully');
                navigate(`/checkout/${result.data.invoiceNumber}`);
            } else {
                alert('Error creating invoice: ' + result.message);
            }
        } catch (error) {
            console.error('Error creating invoice:', error);
            alert('Error creating invoice: ' + error.message);
        }
    };
    
    const totalQty = data.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0);
    const totalPrice = data.reduce((preve, curr) => preve + (curr.quantity * curr?.productId?.sellingPrice), 0);

    return (
        <div className='container mx-auto px-10 py-5'>
            <div className='text-center text-lg my-3'>
                {
                    data.length === 0 && !loading && (
                        <p className='bg-white py-5'>Your Cart is Empty</p>
                    )
                }
            </div>
            <div className='flex flex-col lg:flex-row gap-10 lg:justify-between'>
                {/* view product */}
                <div className='w-full max-w-4xl'>
                    {
                        loading ? (
                            loadingCart.map((el, index) => {
                                return (
                                    <div key={el + 'Add To Cart Loading...' + index} className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded'>
                                    </div>
                                )
                            })
                        ) : (
                            data.map((product, index) => {
                                return (
                                    <div key={product?._id + 'Add To Cart Loading...'} className='w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr]'>
                                        <div className='w-32 h-32 bg-slate-200'>
                                            <img src={product?.productId?.productImage[0]} className='w-full h-full object-scale-down mix-blend-multiply' />
                                        </div>
                                        <div className='px-4 py-2 relative'>
                                            {/* delete product */}
                                            <div className='absolute right-0 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer' onClick={() => deleteCartProduct(product?._id)}>
                                                <MdDelete />
                                            </div>
                                            <h2 className='text-lg lg:text-xl text-ellipsis line-clamp-1'>{product?.productId?.productName}</h2>
                                            <p className='capitalize text-slate-500'>{product?.productId?.category}</p>
                                            <div className='flex items-center justify-between'>
                                                <p className='text-red-600 font-medium text-lg'>{displayINRCurrency(product?.productId?.sellingPrice)}</p>
                                                <p className='text-slate-600 font-semibold text-lg'>{displayINRCurrency(product?.productId?.sellingPrice * product?.quantity)}</p>
                                            </div>
                                            <div className='flex items-center gap-3 mt-1'>
                                                <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded' onClick={() => decreaseQty(product?._id, product?.quantity)}>-</button>
                                                <span>{product?.quantity}</span>
                                                <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded' onClick={() => increaseQty(product?._id, product?.quantity)}>+</button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )
                    }
                </div>
                {/* summary */}
                <div className='mt-5 lg:mt-0 w-full max-w-sm'>
                    {
                        loading ? (
                            <div className='h-36 bg-slate-200 border border-slate-300 animate-pulse rounded'></div>
                        ) : (
                            <div className='w-full p-5 bg-white border border-slate-300 rounded'>
                                <h2 className='text-2xl font-semibold mb-2'>Summary</h2>
                                <div className='flex justify-between mb-2'>
                                    <span>Total Quantity:</span>
                                    <span>{totalQty}</span>
                                </div>
                                <div className='flex justify-between mb-2'>
                                    <span>Total Price:</span>
                                    <span>{displayINRCurrency(totalPrice)}</span>
                                </div>
                                <button
                                    className='w-full bg-red-600 text-white py-2 rounded mt-4'
                                    onClick={() => setShowForm(true)}
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        )
                    }
                </div>
            </div>
            {/* checkout form */}
            {showForm && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
                    <div className='bg-white p-5 rounded w-full max-w-lg'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-2xl font-semibold'>Checkout</h2>
                            <button onClick={() => setShowForm(false)}>
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className='mb-4'>
                                <label className='block mb-2'>Full Name</label>
                                <input type='text' name='fullName' className='w-full border border-slate-300 p-2 rounded' required />
                            </div>
                            <div className='mb-4'>
                                <label className='block mb-2'>Country</label>
                                <Select
                                    options={countries}
                                    value={selectedCountry}
                                    onChange={setSelectedCountry}
                                    required
                                />
                            </div>
                            <div className='mb-4'>
                                <label className='block mb-2'>State</label>
                                <Select
                                    options={states}
                                    value={selectedState}
                                    onChange={setSelectedState}
                                    required
                                />
                            </div>
                            <div className='mb-4'>
                                <label className='block mb-2'>City</label>
                                <Select
                                    options={cities}
                                    value={selectedCity}
                                    onChange={setSelectedCity}
                                    required
                                />
                            </div>
                            <div className='mb-4'>
                                <label className='block mb-2'>Phone Number</label>
                                <PhoneInput
                                    country={'us'}
                                    value={phone}
                                    onChange={setPhone}
                                    inputStyle={{ width: '100%' }}
                                    required
                                />
                            </div>
                            <div className='mb-4'>
                                <label className='block mb-2'>Address</label>
                                <textarea name='address' className='w-full border border-slate-300 p-2 rounded' required />
                            </div>
                            <div className='mb-4'>
                                <label className='block mb-2'>Email</label>
                                <input type='email' name='email' className='w-full border border-slate-300 p-2 rounded' value={userDetails.email} readOnly />
                            </div>
                            <button type='submit' className='w-full bg-red-600 text-white py-2 rounded'>
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
