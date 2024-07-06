import React, { useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';


const ProductHistory = () => {
  const getProductHistory=async ()=>{
       const {productHistory}=(await axios.get('/api/v1/userdata')).data['productHistory'];
      console.log(productHistory)
       
  }
  useEffect(()=>{
      getProductHistory()
  },[])
  return (
    <div>
      hello
    </div>
  )
}

export default ProductHistory
