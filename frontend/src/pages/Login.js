import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { Context } from '../context';
import loginIcons from '../assets/signin.gif';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
      const response = await fetch(SummaryApi.signIn.url, {
        method: SummaryApi.signIn.method,
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        navigate('/');
        fetchUserDetails();
        fetchUserAddToCart();
      } 
      if(result.error) {
        toast.error(result.message);
      }
    }

  return (
    <section id='login'>
      <div className='mx-auto container p-4'>
        <div className='bg-white p-5 w-full max-w-sm mx-auto rounded'>
          <div className='w-20 h-20 mx-auto'>
            <img src={loginIcons} alt='login icons' />
          </div>
          <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
            <div className='bg-slate-100 p-2 mt-4'>
              <input
                type='email'
                placeholder='Email Address...'
                onChange={handleOnChange}
                value={data.email}
                name='email'
                required
                className='w-full h-full outline-none bg-transparent'
              />
            </div>
            <div className='bg-slate-100 p-2 flex mt-4'>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Password...'
                onChange={handleOnChange}
                value={data.password}
                name='password'
                required
                className='w-full h-full outline-none bg-transparent'
              />
              <div className='cursor-pointer text-xl' onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            <button className='w-full p-2 text-center bg-blue-500 hover:bg-blue-600 text-white rounded-full'>
              Login
            </button>
            <div className='flex justify-between mt-4'>
              <p>Not have account?</p>
              <Link to='/signup' className='text-blue-500 hover:text-blue-600'>
                Signup
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
