/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");
const cors =require("cors");
const {setGlobalOptions} = require("firebase-functions/v2");
const express = require("express");

setGlobalOptions({maxInstances: 10});

const app = express();
app.use(cors());
const Razorpay = require("razorpay");

const instance = new Razorpay({
  key_id: "rzp_test_wxHnakUuxyl17T",

  key_secret: "4UIk5Rk1TapR4FYagkGjreGW",
});

app.post("/", (req, res) => {
  const {currency, receipt} = req.body;

  // eslint-disable-next-line max-len
  instance.orders.create({amount: 48000, currency, receipt}, (err, order) => {
    if (!err) res.json(order);
    else res.send(err);
  });
});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = onRequest(app);
