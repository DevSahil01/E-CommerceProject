const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const stripe = require("stripe")('sk_test_51P4OwRSBpU0u3ybfd8sHqbpIQmy4Ng1YDf8rJEkOGvVTbHMftF8zL4I4YmREgrIKGOsiSh3PfJstTDkuamMEMEOV00PoG4danO')


exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: {
      company: "Ecommerce",
    },
  });

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY,stripeClientSecret:process.env.STRIPE_SECRET_KEY});
});
