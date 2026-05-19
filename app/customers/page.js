"use client"
import { useState } from "react";

export default function Customers() {

  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");

  function addCustomer() {
    setCustomers([...customers, name]);
    setName("");
  }

  return (
    <div style={{padding:"30px"}}>

      <h2>Customer Management</h2>

      <input
        placeholder="Customer Name"
        value={name}
        onChange={(e)=>setName(e.target.value)}
      />

      <button onClick={addCustomer}>Add</button>

      <ul>
        {customers.map((c,i)=>(
          <li key={i}>{c}</li>
        ))}
      </ul>

    </div>
  );
}