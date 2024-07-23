import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { GrSearch } from 'react-icons/gr';
import { FaRegCircleUser} from 'react-icons/fa6';
import { FaShoppingCart } from 'react-icons/fa';
import Logo from './Logo';
import SummaryApi from '../common';
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import { Context } from '../context';

const Header = () => {
  const user = useSelector(state => state?.user?.user);
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const searchQuery = searchParams.getAll('q');
  const [search, setSearch] = useState(searchQuery);

  const handleLogout = async () => {
        const response = await fetch(SummaryApi.logout_user.url, {
        method: SummaryApi.logout_user.method,
        credentials: 'include',
      });
      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        dispatch(setUserDetails(null));
        navigate('/');
      } 
      if(result.error) {
        toast.error(result.message);
      }
    }


  const handleSearch = (e) => {
    const {value} = e.target;
    setSearch(value);
    if (value) {
      navigate(`/search?q=${value}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <header className='h-24 shadow-md bg-white fixed w-full z-40'>
      <div className='h-full container mx-auto flex items-center justify-between px-10'>
        <Link to='/'>
          <Logo />
        </Link>
        <div className='hidden lg:flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow pl-2'>
          <input
            type='text'
            placeholder='search products...'
            className='w-full outline-none'
            value={search}
            onChange={handleSearch}
          />
          <div className='text-lg min-w-[50px] bg-red-600 h-8 flex items-center justify-center rounded-r-full text-white'>
            <GrSearch />
          </div>
        </div>
        <div className='flex items-center gap-7'>
          <nav>
            <Link to='/' className='p-4 font-semibold' style={{ fontSize: '18px' }}>
              Home
            </Link>
            <Link to='/product-category' className='p-4 font-semibold' style={{ fontSize: '18px' }}>
              Products
            </Link>
            <Link to='/aboutus' className='p-4 font-semibold' style={{ fontSize: '18px' }}>
              About Us
            </Link>
            <Link to='/contactus' className='p-4 font-semibold' style={{ fontSize: '18px' }}>
              Contact Us
            </Link>
          </nav>
         
            <div className='relative flex justify-center'>
            {
              user?._id && (
              <div
                className='text-3xl cursor-pointer'
                onClick={() => setMenuDisplay((prev) => !prev)}
              >
                {
                  user?.profilePic ? (
                  <img
                    src={user?.profilePic}
                    className='w-10 h-10 rounded-full'
                    alt={user?.name}
                  />
                ) : (
                  <FaRegCircleUser />
                )}
              </div>
              )}

              {
                menuDisplay && (
                <div className='absolute bg-white bottom-0 top-11 h-fit p-2 shadow-lg rounded'>
                  <nav>
                    {user?.role === ROLE.ADMIN && (
                      <Link
                        to='/admin-panel/all-products'
                        className='whitespace-nowrap hover:bg-slate-100 p-2 hidden md:block'
                        onClick={() => setMenuDisplay((prev) => !prev)}
                      >
                        Admin Panel
                      </Link>
                    )}
                  </nav>
                </div>
              )}
            </div>
          
          {user?._id && user?.role === ROLE.GENERAL && (
            <Link to='/cart' className='text-3xl cursor-pointer relative'>
              <span><FaShoppingCart/></span>
              {
                user?._id && (
                    <div className='bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3'>
                    <p className='text-sm'>{context.cartProductCount}</p>
                    </div>
                )
              }
              
            </Link>
          )}
          <div>
            {user?._id ? (
              <button
                onClick={handleLogout}
                className='px-3 py-1 rounded-full text-white bg-blue-600 hover:bg-blue-700'
              >
                Logout
              </button>
            ) : (
              <Link
                to='/login'
                className='px-3 py-1 rounded-full text-white bg-blue-600 hover:bg-blue-700'
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
