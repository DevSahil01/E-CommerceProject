const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Razorpay = require("razorpay");

// Create new Order
// exports.newOrder = catchAsyncErrors(async (req, res, next) => {
//   const {
//     shippingInfo,
//     orderItems,
//     paymentInfo,
//     itemsPrice,
//     taxPrice,
//     shippingPrice,
//     totalPrice,
//   } = req.body;

//   const order = await Order.create({
//     shippingInfo,
//     orderItems,
//     paymentInfo,
//     itemsPrice,
//     taxPrice,
//     shippingPrice,
//     totalPrice,
//     paidAt: Date.now(),
//     user: req.user._id,
//   });

//   res.status(201).json({
//     success: true,
//     order,
//   });
// });

//create id on new payment
exports.createID=catchAsyncErrors(async (req,res,next)=>{
      var instance = new Razorpay({
         key_id:process.env.RAZORPAY_KEY_ID,
         key_secret:process.env.RAZORPAY_KEY_SECRET
      })

      var options={
         amount:parseInt(req.body.amount),
         currency:"INR",
         receipt:"order_rcptid_1"
      }

      instance.orders.create(options,function(err,order){
         if(!err){
            res.status(200).send({
                orderInfo:order,
                key_id:process.env.RAZORPAY_KEY_ID                
            })
         }else{
            res.status(500).send({
               message:"Error while creating order"
            })
         }
      })
})

// get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// get logged in user  Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// get all Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// update Order Status -- Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHander("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.Stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

// delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});


///cancel order from user side
exports.cancelOrder=catchAsyncErrors(async(req,res,next)=>{
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }
  if (order.orderStatus === "cancelled") {
    return next(new ErrorHander("You have already cancelled this order", 400));
  }
  else if(order.orderStatus === "Delivered" || order.orderStatus==="Shipped"){
      return next(new ErrorHander(`The item is already ${order.orderStatus}`,400))
  }
  order.orderStatus = "cancelled";
  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });

})
