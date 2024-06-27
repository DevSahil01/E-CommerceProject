import React,{useRef} from'react'
import { useSelector } from 'react-redux';
import {ArrowLeft, NavigateBefore,NavigateNext} from '@material-ui/icons';
import ProductCard from '../Home/ProductCard';

const MycartItems = () => {
  const {cartItems}=useSelector((state)=>state.cart);
  const { loading, error, products } = useSelector((state) => state.products);
  const containerRef=useRef(null);
  const getTotalAmount=(Total,num)=>{
     return Total+num.price;
  }
  const total=cartItems.reduce(getTotalAmount,0);
  const percentage=100-parseFloat((Math.abs(499-total)/499)*100).toFixed(2);
  const fillerStyle={
    height:'100%',
    width:`${percentage}%`,
    backgroundColor:'#067D62',
    borderRadius:'inherit'
  }


  const scrollView=(direction)=>{
      if(direction==='left'){
         containerRef.current.scrollBy({
           top:0,
           left:-200,
           behavior: 'smooth'
         })
      }
      else if('right') {
        containerRef.current.scrollBy({
          top:0,
          left:+200,
          behavior: 'smooth'
        })
      }
  }
  console.log(percentage)
  
  return (
    <div>
     <h2 className="homeHeading">Continue Shopping</h2>
     <div className="container" id="container">
      <div className='cartItems' >
        <NavigateBefore onClick={()=>scrollView('left')}/>
        <div ref={containerRef} id='cartContainer'>
        {
        cartItems.length &&  
        cartItems.map((item)=>{
            return  <ProductCard key={item.id} Comp={'cart'} product={item}/>
        })
          }
        </div>
      
      <NavigateNext onClick={()=>scrollView('right')}/>
      </div>
      <div className='checkoutSection'>
         <div className='statusBar'>
            <div className='filler' style={fillerStyle}></div>
         </div><span>₹ 499</span>
          {total<499?<p>Add items worth {499-total} for Free Delivery</p>:<p>Your order is eligible for free delivery</p>}
          <p>Subtotal ({cartItems.length} items):<b>{`₹ ${total}`} </b> </p>
          <button>Proced to buy</button>
      </div>
    
     </div>
     
     
    </div>
  )
}

export default MycartItems
