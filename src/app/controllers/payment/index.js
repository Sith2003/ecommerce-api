const config = require("../../../config");
const { Order } = require("../../models");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(config.STRIPE_SECRET_KEY);
const endpoint_secret = config.STRIPE_ENDPOINT;

const createCheckout = async (req, res) => {
  try {
    const { information, product } = req.body;
    const orderId = uuidv4();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "thb",
            product_data: {
              name: product.name,
            },
            unit_amount: product.price * 100,
          },
          quantity: product.quantity,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:8888/success.html?id=${orderId}`,
      cancel_url: `http://localhost:8888/cancel.html?id=${orderId}`,
    });
    const data = {
      name: information.name,
      address: information.address,
      sessionId: session.id,
      status: session.status,
      orderId: orderId,
    };
    const order = await Order.create(data);
    return res.status(200).json({
      message: "Checkout success",
      id: session.id,
      order,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

const webhooks = async (req, res) => {
  console.log("Webhook received");
  const rawBody = req.body.toString();
  console.log("Event type:", req.body);
  const sig = req.headers["stripe-signature"];
  console.log("sig:::::::::::::::::::::::",sig)
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpoint_secret);
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      console.log("Handling checkout.session.completed event");
      try {
        const paymentData = event.data.object;
        console.log("paymentData", paymentData);
        const sessionId = paymentData.id;
        const status = paymentData.status;
        await Order.updateOne({ sessionId: sessionId }, { status: status });
        console.log("result", status);
      } catch (err) {
        console.error("Error handling checkout.session.completed event:", err);
      }
      break;
    // case 'payment_intent.succeeded':
    //   const paymentIntentSucceeded = event.data.object;
    //   console.log(paymentIntentSucceeded)
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  res.send();
};

module.exports = {
  createCheckout,
  webhooks,
};
