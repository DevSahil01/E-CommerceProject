import React, { useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ProductCard from './ProductCard';


const ProductHistory = () => {
  const [productHistory,setProductHistory]=React.useState({});
  const getProductHistory=async ()=>{
       const {productHistory}=(await axios.get('/api/v1/userdata')).data['productHistory'];
       setProductHistory(productHistory)
  }
  useEffect(()=>{
      getProductHistory()
  },[])
  return (
    <div>
       <h2 className="homeHeading">Recently viewed </h2>
       <div className="container" id="container">
       <div  className='cartItems' >
        {
        productHistory.length &&  
        productHistory.map((item)=>{
            return  <ProductCard key={item.id}  product={item.productId}/>
        })
          }
        </div>

       </div>
    </div>
  )
}

export default ProductHistory
