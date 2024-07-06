import React, { useEffect } from 'react'
import axios from 'axios';


const ProductHistory = () => {
  useEffect(()=>{
      axios.get('/api/v1/userdata')
      .then(res=>console.log(res,'request is deployed')).catch(err=>console.log(err))
  },[])
  return (
    <div>
      hello
    </div>
  )
}

export default ProductHistory
