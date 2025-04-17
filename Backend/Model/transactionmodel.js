import mongoose from "mongoose";// Define the Transaction schema
const transactionSchema = new mongoose.Schema(
  {product_id: {
      type: String, 
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0, // Amount should not be negative
    },
    status: {
      type: String,
      required: true,
      enum: ["PENDING", "COMPLETE", "FAILED", "REFUNDED"], // Example statuses
      default: "PENDING",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);
// Create the Transaction model from the schema
export const Transaction = mongoose.model("Transaction", transactionSchema);