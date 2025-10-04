const express = require("express");
const Stripe = require("stripe");
require("dotenv").config();

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body; // amount in paise (e.g., ₹500 = 50000)
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "inr",
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Payment intent creation failed" });
  }
});

module.exports = router;