"use client"
import { useState } from "react";

export default function LaundrySystem(){

const [customer,setCustomer] = useState("");
const [service,setService] = useState("");
const [payment,setPayment] = useState("");
const [orders,setOrders] = useState([]);

function addOrder(e){

e.preventDefault(); // prevent page refresh

if(!customer || !service || !payment){
alert("Please complete all fields");
return;
}

const newOrder = {
customer: customer,
service: service,
payment: payment,
status:"Pending"
};

setOrders(prev => [...prev, newOrder]);

setCustomer("");
setService("");
setPayment("");
}

return(

<div style={styles.container}>

<h1 style={styles.title}>Laundry Shop Management System 🧺</h1>

<form onSubmit={addOrder} style={styles.form}>

<input
placeholder="Customer Name"
value={customer}
onChange={(e)=>setCustomer(e.target.value)}
style={styles.input}
/>

<select
value={service}
onChange={(e)=>setService(e.target.value)}
style={styles.input}
>
<option value="">Select Service</option>
<option value="Wash">Wash</option>
<option value="Dry">Dry</option>
<option value="Wash & Dry">Wash & Dry</option>
<option value="Full Service">Full Service</option>
</select>

<select
value={payment}
onChange={(e)=>setPayment(e.target.value)}
style={styles.input}
>
<option value="">Payment Method</option>
<option value="Cash">Cash</option>
<option value="GCash">GCash</option>
</select>

<button type="submit" style={styles.button}>
Add Laundry Order
</button>

</form>

<table style={styles.table}>

<thead>
<tr>
<th>Customer</th>
<th>Service</th>
<th>Payment</th>
<th>Status</th>
</tr>
</thead>

<tbody>

{orders.length === 0 ? (
<tr>
<td colSpan="4" style={{textAlign:"center"}}>No orders yet</td>
</tr>
) : (
orders.map((order,index)=>(
<tr key={index}>
<td>{order.customer}</td>
<td>{order.service}</td>
<td>{order.payment}</td>
<td>{order.status}</td>
</tr>
))
)}

</tbody>

</table>

</div>

)

}

const styles = {

container:{
padding:"40px",
fontFamily:"Arial",
background:"#f4f6fb",
minHeight:"100vh"
},

title:{
textAlign:"center",
marginBottom:"30px"
},

form:{
display:"flex",
gap:"10px",
justifyContent:"center",
marginBottom:"30px",
flexWrap:"wrap"
},

input:{
padding:"10px",
borderRadius:"6px",
border:"1px solid #ccc"
},

button:{
padding:"10px 20px",
background:"#4CAF50",
color:"#fff",
border:"none",
borderRadius:"6px",
cursor:"pointer"
},

table:{
width:"100%",
borderCollapse:"collapse",
background:"#fff"
}

};