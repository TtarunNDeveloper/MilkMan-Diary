import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import SummaryApi from './common';
import {Context} from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';

function App() {
  const [cartProductCount, setCartProductCount] = useState(0);
  const dispatch = useDispatch();

  const fetchUserDetails = async () => {
    
    
    try {
        const response = await fetch(SummaryApi.get_user_details.url, {
            method: SummaryApi.get_user_details.method,
            credentials: 'include'
        });
        const data = await response.json();

        if (data.success) {
            dispatch(setUserDetails(data.user));
        } else {
            dispatch(setUserDetails(null));
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        dispatch(setUserDetails(null));
    }
};

  const fetchUserAddToCart = async() => {
    const dataResponse = await fetch(SummaryApi.addToCartProductCount.url, {
      method: SummaryApi.addToCartProductCount.method,
      credentials: 'include'
    })

    const dataApi = await dataResponse.json();
    setCartProductCount(dataApi?.data?.count);
  } 

  useEffect(() => {
    /* user details */
    fetchUserDetails()
    /* user details cart product */
    fetchUserAddToCart()
  },[])
  return (
    <>
      <Context.Provider value={{
        fetchUserDetails, // user details fetch
        cartProductCount, // current user add to cart product count
        fetchUserAddToCart 
      }}>
        <ToastContainer
          position='top-center'
        />
        <Header />
        <main className='min-h-[calc(100vh-120px)] pt-16'>
          <Outlet />
        </main>
        <Footer />
      </Context.Provider>
    </>
    
  );
}

export default App;
