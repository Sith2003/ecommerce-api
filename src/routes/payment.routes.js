const { paymentController } = require('../app/controllers');
const express = require('express');

module.exports = (app) => {
    app.post('/checkout', paymentController.createCheckout)
    app.post('/webhook', express.raw({type: 'application/json'}), paymentController.webhooks)
}