import React from 'react';
import CategoryList from '../components/CategoryList';
import BannerProduct from '../components/BannerProduct';
import HorizontalCardProduct from '../components/HorizontalCardProduct';
import VerticalCardProduct from '../components/VerticalCardProduct';

const Home = () => {
  return (
    <div>
      <CategoryList />
      <BannerProduct />
      <HorizontalCardProduct category={'curd'} heading={'Curd Products'} />
      <HorizontalCardProduct category={'sweets'} heading={'Sweet Products'} />
      <VerticalCardProduct category={'milk'} heading={'Milk Products'} />
    </div>
  )
}

export default Home
