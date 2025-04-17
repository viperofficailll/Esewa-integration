import { Transaction } from "../Model/transactionmodel.js";
import { EsewaPaymentGateway,EsewaCheckStatus } from "esewajs"; //we install our package hehe


const EsewaInitiatePayment=async(req,res)=>{
  const { amount, productId } = req.body;  //data coming from frontend
try {
  const  reqPayment=await EsewaPaymentGateway(
    amount,
    0, // productDeliveryCharge
    0, // productServiceCharge
    0, // taxAmount
    productId, // transaction_uuid
    process.env.MERCHANT_ID, // product_code
    process.env.SECRET,
    process.env.SUCCESS_URL,
    process.env.FAILURE_URL,
    process.env.ESEWAPAYMENT_URL
  )
if(!reqPayment){
  console.error("Payment gateway returned no response");
  return res.status(400).json({success: false, message: "Error initiating payment"});
}

if (reqPayment.status === 200) {
  const transaction = new Transaction({
    product_id: productId,
    amount: amount,
    status: "PENDING"
  });
  await transaction.save();
  console.log("Transaction saved successfully");
  
  if (reqPayment.request && reqPayment.request.res && reqPayment.request.res.responseUrl) {
    return res.status(200).json({
      success: true,
      url: reqPayment.request.res.responseUrl
    });
  } else {
    console.error("No response URL in payment response");
    return res.status(400).json({success: false, message: "No payment URL received"});
  }
} else {
  console.error("Payment gateway returned non-200 status:", reqPayment.status);
  return res.status(400).json({success: false, message: "Error initiating payment"});
}
}
catch (error) {
  console.error("Error in payment initiation:", error);
  return res.status(500).json({success: false, message: "Server error", error: error.message});
}}



const paymentStatus=async (req, res) => {
  const { product_id } = req.body; // Extract data from request body
  try {
    // Find the transaction by its signature
    const transaction = await Transaction.findOne({ product_id });
    if (!transaction) {
      console.error("Transaction not found:", product_id);
      return res.status(400).json({ success: false, message: "Transaction not found" });
    }
    
    console.log("Checking payment status for transaction:", product_id);
    const paymentStatusCheck = await EsewaCheckStatus(
      transaction.amount,
      transaction.product_id,
      process.env.MERCHANT_ID,
      process.env.ESEWAPAYMENT_STATUS_CHECK_URL
    );
    
    console.log("Payment status check response:", paymentStatusCheck);
    
    if (paymentStatusCheck && paymentStatusCheck.status === 200) {
      // Update the transaction status
      transaction.status = paymentStatusCheck.data.status || "COMPLETE";
      await transaction.save();
      console.log("Transaction status updated to:", transaction.status);
      return res.status(200).json({ 
        success: true,
        message: "Transaction status updated successfully",
        status: transaction.status
      });
    } else {
      console.error("Payment status check failed:", paymentStatusCheck);
      return res.status(400).json({ 
        success: false, 
        message: "Failed to verify payment status" 
      });
    }
  } catch (error) {
    console.error("Error updating transaction status:", error);
    return res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};

export {EsewaInitiatePayment,paymentStatus}