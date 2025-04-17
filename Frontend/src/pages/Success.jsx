import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { base64Decode } from "esewajs";
import axios from "axios";

const Success = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Create a new URLSearchParams object using the search string from location
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("data");
  
  console.log("Token from URL:", token);
  
  const verifyPaymentAndUpdateStatus = async () => {
    try {
      if (!token) {
        console.error("No token found in URL");
        setErrorMessage("No payment data found in URL");
        setIsLoading(false);
        return;
      }
      
      // Decode the JWT without verifying the signature
      let decoded;
      try {
        console.log("Attempting to decode token...");
        const decodedString = base64Decode(token);
        console.log("Decoded string:", decodedString);
        
        try {
          decoded = JSON.parse(decodedString);
          console.log("Parsed JSON:", decoded);
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
          setErrorMessage("Error parsing payment data");
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setErrorMessage("Error decoding payment data");
        setIsLoading(false);
        return;
      }
      
      if (!decoded || !decoded.transaction_uuid) {
        console.error("Invalid decoded data:", decoded);
        setErrorMessage("Invalid payment data format");
        setIsLoading(false);
        return;
      }
      
      console.log("Sending payment status verification request...");
      const response = await axios.post(
        "/api/v1/users/payment-status",
        {
          product_id: decoded.transaction_uuid,
        }
      );
      
      console.log("Payment status response:", response.data);
      
      if (response.status === 200 && response.data.success) {
        setIsLoading(false);
        setIsSuccess(true);
      } else {
        console.error("Payment verification failed:", response.data);
        setErrorMessage(response.data.message || "Payment verification failed");
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error verifying payment:", error);
      setErrorMessage(error.response?.data?.message || "Error verifying payment");
    }
  };
  
  useEffect(() => {
    verifyPaymentAndUpdateStatus();
  }, []);
  
  if (isLoading && !isSuccess) return <>Loading...</>;
  
  if (!isLoading && !isSuccess)
    return (
      <>
        <h1>Oops!..Error occurred on confirming payment</h1>
        <h2>{errorMessage || "We will resolve it soon."}</h2>
        <button onClick={() => navigate("/")} className="go-home-button">
          Go to Homepage
        </button>
      </>
    );
  
  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Thank you for your payment. Your transaction was successful.</p>
      <button onClick={() => navigate("/")} className="go-home-button">
        Go to Homepage
      </button>
    </div>
  );
};

export default Success;