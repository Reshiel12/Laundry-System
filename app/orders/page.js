"use client"
import { useState } from "react";

export default function Orders(){

  const [orders,setOrders] = useState([]);
  const [customer,setCustomer] = useState("");
  const [service,setService] = useState("");

  function addOrder(){

    const newOrder = {
      customer,
      service,
      status:"Pending"
    };

    setOrders([...orders,newOrder]);

    setCustomer("");
    setService("");
  }

  return(
    <div style={{padding:"30px"}}>

      <h2>Laundry Orders</h2>

      <input
        placeholder="Customer Name"
        value={customer}
        onChange={(e)=>setCustomer(e.target.value)}
      />

      <input
        placeholder="Service (Wash & Dry)"
        value={service}
        onChange={(e)=>setService(e.target.value)}
      />

      <button onClick={addOrder}>Add Order</button>

      <table border="1" style={{marginTop:"20px"}}>

        <thead>
          <tr>
            <th>Customer</th>
            <th>Service</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o,i)=>(
            <tr key={i}>
              <td>{o.customer}</td>
              <td>{o.service}</td>
              <td>{o.status}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  )
}