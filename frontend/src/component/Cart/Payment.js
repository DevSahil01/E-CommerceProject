import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors } from "../../actions/productAction";
import { createOrder } from "../../actions/orderAction";
import { useNavigate } from "react-router-dom";
import { emptyCart } from "../../actions/cartAction";
import logo from '../../images/logo.png'



const CheckOut=()=>{
   const dispatch=useDispatch();
   const {order,error}=useSelector((state)=>state.newOrder)
   const navigate=useNavigate();
   const {user}=useSelector((state)=>state.user);
   let {totalPrice}=JSON.parse(sessionStorage.getItem('orderInfo'));

   const  loadScript=(src)=>{
       return new Promise((resolve)=>{
          const script=document.createElement('script');

          script.src='https://checkout.razorpay.com/v1/checkout.js';

         script.onload =resolve(true);

          script.onerror=()=>{
               alert("error while payment process")
          }
          
          document.body.appendChild(script);
         })
      }
   const clearCart=()=>{
      dispatch(emptyCart())
   }
   const loadScreen=async ()=>{
      //  const res=await loadScript();
      //  if (!res) {
      //    return;
      //  }
       if (!window.Razorpay) {
         alert('Razorpay SDK not available.');
         return;
       }
       let options={
          "key":order.key_id,
          "name":"E-commerce Platform",
          "currency":"INR",
          "amount":totalPrice*100,
          "order_id":order.orderInfo.id,
          "description":"This is test payment",
          "image":logo,
          "handler": function (response) {
          const data = {
                orderCreationId: order.orderInfo.id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
            };
            
           sessionStorage.removeItem('orderInfo');

           clearCart();
           
           navigate('/orders');
           
        },
          "prefill":{
            "name":user.name,
            "email":user.email,
            "contact":"7039986842"
          }
          ,
          "modal": {
         "ondismiss": function() {
            alert("Payment process was cancelled. You can try again.");
            navigate('/order/confirm');
        }
      }
         }
         const paymentObject = new window.Razorpay(options);
         await paymentObject.open();
         
      }
     
   useEffect(()=>{
      dispatch(createOrder({amount:totalPrice}));

   },[dispatch])

   useEffect(()=>{
       if(order && user){
         loadScreen()
       }
   },[order,user])
   return (
      <form>
        
      </form>
   )
}

export default CheckOut;













































// import React, { useState,Fragment, useEffect, useRef } from "react";
// import CheckoutSteps from "../Cart/CheckoutSteps";
// import { useSelector, useDispatch } from "react-redux";
// import MetaData from "../layout/MetaData";
// import { Typography } from "@material-ui/core";
// import { useAlert } from "react-alert";
// import {
//   CardNumberElement,
//   CardCvcElement,
//   CardExpiryElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";

// import axios from "axios";
// import "./payment.css";
// import CreditCardIcon from "@material-ui/icons/CreditCard";
// import EventIcon from "@material-ui/icons/Event";
// import VpnKeyIcon from "@material-ui/icons/VpnKey";
// import { createOrder, clearErrors } from "../../actions/orderAction";

// const Payment = ({ history }) => {
//   const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

//   const dispatch = useDispatch();
//   const alert = useAlert();
//   const stripe = useStripe();
//   const elements = useElements();
//   const payBtn = useRef(null);

//   const { shippingInfo, cartItems } = useSelector((state) => state.cart);
//   const { user } = useSelector((state) => state.user);
//   const { error } = useSelector((state) => state.newOrder);

//   const paymentData = {
//     amount: Math.round(orderInfo.totalPrice * 100),
//   };
//   ///4000003560000008 <--- test card number

//   const order = {
//     shippingInfo,
//     orderItems: cartItems,
//     itemsPrice: orderInfo.subtotal,
//     taxPrice: orderInfo.tax,
//     shippingPrice: orderInfo.shippingCharges,
//     totalPrice: orderInfo.totalPrice,
//   };
//   const [stripeApiKey, setStripeApiKey] = useState("");
//   async function getStripeApiKey() {
//     const { data } = await axios.get("/api/v1/stripeapikey");
//     setStripeApiKey(data.stripeApiKey)
//   }
//   const submitHandler = async (e) => {
//     e.preventDefault();

//     payBtn.current.disabled = true;

//     try {
//       const config = {
//         headers: {
//           'Authorization':`Bearer ${stripeApiKey}`,
//           "Content-Type": "application/json",
//         },
//       };
//       const { data } = await axios.post(
//         "/api/v1/payment/process",
//         paymentData,
//         config
//       );

//       const client_secret = data.client_secret;

//       if (!stripe || !elements) return;

//       const result = await stripe.confirmCardPayment(client_secret, {
//         payment_method: {
//           card: elements.getElement(CardNumberElement),
//           billing_details: {
//             name: user.name,
//             email: user.email,
//             address: {
//               line1: shippingInfo.address,
//               city: shippingInfo.city,
//               state: shippingInfo.state,
//               postal_code: shippingInfo.pinCode,
//               country: shippingInfo.country,
//             },
//           },
//         },
//       });

//       if (result.error) {
//         payBtn.current.disabled = false;

//         alert.error(result.error.message);
//       } else {
//         if (result.paymentIntent.status === "succeeded") {
//           order.paymentInfo = {
//             id: result.paymentIntent.id,
//             status: result.paymentIntent.status,
//           };

//           dispatch(createOrder(order));

//           history.push("/success");
//         } else {
//           alert.error("There's some issue while processing payment ");
//         }
//       }
//     } catch (error) {
//       payBtn.current.disabled = false;
//       alert.error(error.response.data.message);
//     }
//   };

//   useEffect(() => {
//     if (error) {
//       alert.error(error);
//       dispatch(clearErrors());
//     }
//     getStripeApiKey()
//   }, [dispatch, error, alert]);
//   return (
//     <Fragment>
//       <MetaData title="Payment" />
//       <CheckoutSteps activeStep={2} />
//       <div className="paymentContainer">
//         <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
//           <Typography>Card Info</Typography>
//           <div>
//             <CreditCardIcon />
//             <CardNumberElement className="paymentInput" />
//           </div>
//           <div>
//             <EventIcon />
//             <CardExpiryElement className="paymentInput" />
//           </div>
//           <div>
//             <VpnKeyIcon />
//             <CardCvcElement className="paymentInput" />
//           </div>

//           <input
//             type="submit"
//             value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
//             ref={payBtn}
//             className="paymentFormBtn"
//           />
//         </form>
//       </div>
//     </Fragment>
//   );
// };

// export default Payment;
