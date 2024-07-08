import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ProductCard from './ProductCard';


const ProductHistory = () => {
  const [productHistory,setProductHistory]=React.useState({});
  const [displayBox,setDisplayBox]=useState('flex');
  const getProductHistory=async ()=>{
      try{
        const {productHistory}=(await axios.get('/api/v1/userdata')).data['productHistory'];
      }
      catch(err){
         if(err.response.status===401){
              setDisplayBox('none');
         }
      }
      
  }
  useEffect(()=>{
      getProductHistory()
  },[])
  return (
    <div>
      {displayBox==='flex' && 
      <>
       <h2 className="homeHeading">Recently viewed </h2>
       <div className="container" id="container">
       <div  style={{display:displayBox}} >
        {
        productHistory.length &&  
        productHistory.map((item)=>{
            return  <ProductCard key={item.id}  product={item.productId}/>
        })
          }
        </div>
        </div>
        </>
       }
    </div>
  )
}

export default ProductHistory
