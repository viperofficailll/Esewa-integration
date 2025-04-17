import React from 'react'
import { Route,Routes } from 'react-router-dom'
import First from '../src/pages/First'
import PaymentForm from '../src/pages/PaymentForm'
import Success from '../src/pages/Success'
import Failure from '../src/pages/Failure'

function Approutes() {
  return (
<>
<Routes>

    <Route path='/' element={<First></First>}></Route>
    <Route path='/paymentform' element={<PaymentForm></PaymentForm>}></Route>
    <Route path='/success' element={<Success></Success>}></Route>
    <Route path='/failure' element={<Failure></Failure>}></Route>

</Routes>

</>  )
}

export default Approutes