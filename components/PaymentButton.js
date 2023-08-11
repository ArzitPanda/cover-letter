"use client"

import { db } from '@/firebase/init';
import { doc, updateDoc } from 'firebase/firestore';
import React from 'react'
import { useContext } from 'react';
import { Store } from '@/app/layout';
import axios from 'axios';
import {v3} from 'uuid'

const PaymentButton = () => {


const {user,setUser}= useContext(Store); 

    const initializeRazorpay = () => {
        return new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
    
          script.onload = () => {
            resolve(true);
          };
          script.onerror = () => {
            resolve(false);
          };
    
          document.body.appendChild(script);
        });
      };



      const makePayment = async() =>{


        const res = await initializeRazorpay();

        if (!res) {
          alert("Razorpay SDK Failed to load");
          return;
        }
    try{
        const data = await axios.post("https://helloworld-ihcjfha3wa-uc.a.run.app",{
          
            "currency":"INR",
            "receipt":Math.random()*10000+""
        })
        console.log(data);
       const options = {
          key: "rzp_test_wxHnakUuxyl17T", 
          name: "Cover letter pro subscription",
          currency: data.data.currency,
          amount: data.data.amount,
          order_id: data.data.id,
          description: "Thankyou for your subscription",
          image: "https://manuarora.in/logo.png",
          handler:async  function (response) {
               const uid = localStorage.getItem('uid')
            await updateDoc(doc(db, "user", uid), { premium:true });

            alert(response.razorpay_payment_id);
            alert(response.razorpay_order_id);
            alert(response.razorpay_signature);
          },
          prefill: {
            name: "demo ",
            email: "demo",
            contact: "demo",
          },
        };
    
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

    }
    catch(err)
    {
        console.log(err)
    }
        // Make API call to the serverless API
     

      }




  return (
    <div>
      <button onClick={makePayment}>Pro Membership</button>
    </div>
  )
}

export default PaymentButton
