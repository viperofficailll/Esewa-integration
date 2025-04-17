import express from 'express'
export const Userrouter = express.Router()
import { EsewaInitiatePayment, paymentStatus } from '../controller/esewa.controller.js'
Userrouter.post('/initiate-payment', EsewaInitiatePayment)
Userrouter.post('/payment-status', paymentStatus)