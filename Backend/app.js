import express from 'express'
import cors from 'cors'
 export const app = express() 
 app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
 import { Userrouter } from './routes/user.routes.js'

 import { EsewaInitiatePayment, paymentStatus } from './controller/esewa.controller.js'


app.use('/api/v1/users/',Userrouter)


app.get('/', (req,res)=>{

    res.send("hello")
})