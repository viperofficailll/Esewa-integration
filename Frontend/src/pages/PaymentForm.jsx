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
      const response = await axios.post(
        "/api/v1/users/initiate-payment", //server payment route
        {
          amount,
          productId: generateUniqueId(),
        }
      );
      console.log(response.data);

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
    <div>
      <h1>eSewa Payment Integration</h1>

      <div className="form-container">
        <form className="styled-form" onSubmit={handlePayment}>
          <div className="form-group">
            <label htmlFor="Amount">Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="Enter amount"
            />
          </div>

          <button type="submit" className="submit-button">
            Pay with eSewa
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;