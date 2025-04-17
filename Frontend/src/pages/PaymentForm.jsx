import React, { useState } from "react";
import axios from "axios";
import { generateUniqueId } from "esewajs";
import { useNavigate } from "react-router-dom";

const PaymentForm = () => {
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/v1/users/initiate-payment", {
        amount,
        productId: generateUniqueId(),
      });

      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      } else {
        console.error("No payment URL received");
        navigate("/failure");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      navigate("/failure");
    }
  };

  return (
    <div
      className="w-full h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('/money.png')", // replace with your image path
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-2xl p-8 sm:p-10 w-full max-w-md mx-4">
        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          eSewa Payment
        </h1>
        <form onSubmit={handlePayment} className="space-y-5">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="Enter amount"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Pay with eSewa
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
