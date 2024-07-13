import React,{useRef} from'react'
import { useSelector } from 'react-redux';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import {ArrowLeft, ChangeHistory, NavigateBefore,NavigateNext} from '@material-ui/icons';
import ProductCard from '../Home/ProductCard';
import { useNavigate } from 'react-router-dom';

const MycartItems = () => {
  const {cartItems}=useSelector((state)=>state.cart);
  const navigate = useNavigate();
  const { loading, error, products } = useSelector((state) => state.products);
  const containerRef=useRef(null);
  const getTotalAmount=(Total,num)=>{
     return Total+num.price;
  }
  const total=cartItems.reduce(getTotalAmount,0);
  const percentage=100-parseFloat((Math.abs(499-total)/499)*100).toFixed(2);
  const fillerStyle={
    height:'100%',
    width:`${total<499 ? percentage : 100}%`,
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

  const checkoutHandler = () => {
    navigate("/login?redirect=shipping");
  };

  return (
    <>
    {cartItems.length>0 &&
      <div>
      <h2 className="homeHeading">Continue Shopping</h2>
      <div className="container" id="container">
       <div className='cartItems' >
         <NavigateBefore onClick={()=>scrollView('left')}/>
         <div ref={containerRef} id='cartContainer'>
         {cartItems.map((item)=>{
             return  <ProductCard key={item.product} Comp={'cart'} product={item}/>
         }) }
         </div>
       <NavigateNext onClick={()=>scrollView('right')}/>
       </div>
       <div className='checkoutSection'>
         <div>
 
          {total>499 &&<span><CheckCircleIcon style={{color:'#067D62'}}/></span>}<div className='statusBar'>
             <div className='filler' style={fillerStyle}></div>
          </div><span>₹ 499</span>
         </div>
           {total<499?<p>Add items worth {499-total} for Free Delivery</p>:<p>Your order is eligible for free delivery</p>}
           <p>Subtotal ({cartItems.length} items):<b>{`₹ ${total}`} </b> </p>
           <button onClick={checkoutHandler} style={{cursor:'pointer'}}>Proced to buy</button>
       </div>
     
      </div>
     </div>
    }
    </>
    
  )
}

export default MycartItems
