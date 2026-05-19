"use client";

import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot
} from "firebase/firestore";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
const auth = getAuth();
import { useState, useEffect } from "react";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [dark, setDark] = useState(false);

  return (
    <>
      {!loggedIn ? (
        <Login onLogin={() => setLoggedIn(true)} dark={dark} />
      ) : (
        <Dashboard
          dark={dark}
          setDark={setDark}
          onLogout={() => setLoggedIn(false)}
        />
      )}
    </>
  );
}

/* ================= LOGIN ================= */
function Login({ onLogin, dark }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);


const handleLogin = async () => {
  if (!username || !password) {
    setError("Please enter email and password");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, username, password);
    onLogin();
  } catch (error) {
    setError("Invalid email or password");
  }
};

  return (
    <div style={{
      ...styles.loginContainer,
      background: dark
        ? "linear-gradient(135deg, #1e1e2f, #2c2c3e)"
        : "linear-gradient(135deg, #ffd6e0, #cce7ff)",
    }}>
      <div style={styles.loginBox}>
        <h2>💗 Laundry Login</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: "absolute", right: 10, top: 12, cursor: "pointer" }}
          >
            
          </span>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>
      </div>
    </div>
  );
}

/* ================= DASHBOARD ================= */
function Dashboard({ dark, setDark, onLogout }) {

  const [active, setActive] = useState("Dashboard");
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [hiddenOrders, setHiddenOrders] = useState({});
  const [name, setName] = useState("");
  const [kilo, setKilo] = useState("");
  const [service, setService] = useState("Wash & Fold");
  const [payment, setPayment] = useState("Cash");
  const [date, setDate] = useState("");
  const [claimDate, setClaimDate] = useState("");
  const [status, setStatus] = useState("Pending");
  const [editId, setEditId] = useState(null);

  // ✅ ADD THIS HERE (VERY IMPORTANT)
  const editOrder = (o) => {
    setName(o.name);
    setKilo(o.kilo);
    setService(o.service);
    setPayment(o.payment);
    setDate(o.date);
    setClaimDate(o.claimDate);
    setStatus(o.status);
    setEditId(o.id);
  };

  /* 💾 LOAD DATA */
useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setOrders(data);

    // ✅ FIX CUSTOMER LIST
    const uniqueCustomers = [
      ...new Set(
        data
          .map((o) => o.name?.trim())
          .filter((name) => name)
      ),
    ];

    setCustomers(uniqueCustomers);
  });

  return () => unsubscribe();
}, []);

  const bg = dark
    ? "linear-gradient(135deg, #1e1e2f, #2c2c3e)"
    : "linear-gradient(135deg, #ffd6e0, #cce7ff)";

  const card = dark ? "#2c2c3e" : "rgba(255,255,255,0.7)";
  const text = dark ? "#fff" : "#333";

  const menu = [
    { name: "Dashboard", icon: "📊" },
    { name: "Orders", icon: "📦" },
    { name: "Customers", icon: "👥" },
    { name: "Reports", icon: "📄" },
  ];

  const getPrice = () => {
    const rates = {
      "Wash & Fold": 50,
      "Wash & Dry": 70,
      "Dry Clean": 100,
    };
    return Number(kilo) * rates[service];
  };

const addOrder = async () => {
  if (!name || !kilo || !date || !claimDate) return;

  const newOrder = {
    name,
    kilo,
    service,
    payment,
    date,
    claimDate,
    status,
    price: getPrice()
  };

  await addDoc(collection(db, "orders"), newOrder);
  alert("✅ Order Added Successfully!");

};

const deleteOrder = async (id) => {
  await deleteDoc(doc(db, "orders", id));
  alert("🗑 Order Deleted!");
  
};

const updateOrder = async () => {
  if (!editId) return;

  try {
    await updateDoc(doc(db, "orders", editId), {
      name,
      kilo,
      service,
      payment,
      date,
      claimDate,
      status,
      price: getPrice()
    });

    alert("✅Order updated successfully!");
    setEditId(null);
  } catch (error) {
    console.log(error);
    alert("Update failed");
  }
};

  const totalBalance = orders.reduce((sum, o) => sum + o.price, 0);
  const pendingCount = orders.filter(o => o.status === "Pending").length;

  return (
    <div style={{ ...styles.container, background: bg, color: text }}>
      <div style={styles.sidebar}>
        <h2>🧺 Laundry Shop</h2>
        {menu.map(item => (
          <div
            key={item.name}
            onClick={() => setActive(item.name)}
            style={{
              ...styles.menuItem,
              background: active === item.name
                ? "linear-gradient(135deg, #ff9eb3, #7ec8ff)"
                : "transparent",
              color: active === item.name ? "#fff" : text,
            }}
          >
            {item.icon} {item.name}
          </div>
        ))}
      </div>

      <div style={styles.main}>
        <div style={styles.header}>
          <h2>{active}</h2>
          <div style={styles.headerRight}>
            <button onClick={() => setDark(!dark)} style={styles.toggle}>🌙</button>
            <button onClick={onLogout} style={{ ...styles.toggle, background: "#ff6b6b", color: "#fff" }}>
              🚪 Logout
            </button>
          </div>
        </div>

        {active === "Dashboard" && (
          <>
            <div style={styles.balanceCard}>
              <h4>Total Balance</h4>
              <h1>₱{totalBalance}</h1>
            </div>

            <div style={styles.grid}>
              <Card title="Orders" value={orders.length} bg={card} />
              <Card title="Customers" value={customers.length} bg={card} />
              <Card title="Pending" value={pendingCount} bg={card} />
            </div>
          </>
        )}

      {active === "Orders" && (
  <div style={{ ...styles.card, background: card }}>

    {/* 📦 ORDERS HEADER BOX */}
    <div
      style={{
        ...styles.card,
        background: "linear-gradient(135deg, #ff9eb3, #7ec8ff)",
        color: "#fff",
        textAlign: "center",
        marginBottom: "15px",
      }}
    >
      <h2>📦 Orders</h2>
      <p>Manage Laundry Orders</p>
    </div>

    {/* FORM */}
    <input
      placeholder="Customer Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      style={styles.input}
    />

    <input
      type="number"
      placeholder="Kilo"
      value={kilo}
      onChange={(e) => setKilo(e.target.value)}
      style={styles.input}
    />

    <select
      value={service}
      onChange={(e) => setService(e.target.value)}
      style={styles.input}
    >
      <option>Wash & Fold</option>
      <option>Wash & Dry</option>
      <option>Dry Clean</option>
    </select>

    <select
      value={payment}
      onChange={(e) => setPayment(e.target.value)}
      style={styles.input}
    >
      <option>Cash</option>
      <option>GCash</option>
      <option>Card</option>
    </select>

    <input
      type="date"
      value={date}
      onChange={(e) => setDate(e.target.value)}
      style={styles.input}
    />

    <input
      type="date"
      value={claimDate}
      onChange={(e) => setClaimDate(e.target.value)}
      style={styles.input}
    />

    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      style={styles.input}
    >
      <option>Pending</option>
      <option>Completed</option>
    </select>

    <button
      onClick={editId ? updateOrder : addOrder}
      style={styles.button}
    >
      {editId ? "Update Order" : "Add Order"}
    </button>

    <hr />

    {/* 📦 ORDER CARDS */}
    {orders.map((o) => (
      <div
        key={o.id}
        style={{
          background: "linear-gradient(135deg, #ff9eb3, #7ec8ff)",
          color: "#fff",
          padding: "15px",
          borderRadius: "15px",
          marginTop: "15px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
          position: "relative",
        }}
      >

        {/* 👁 HIDE / UNHIDE */}
        <button
          onClick={() =>
            setHiddenOrders({
              ...hiddenOrders,
              [o.id]: !hiddenOrders[o.id],
            })
          }
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            border: "none",
            background: "#fff",
            borderRadius: "50%",
            width: "35px",
            height: "35px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          {hiddenOrders[o.id] ? "🙈" : "👁"}
        </button>

        {!hiddenOrders[o.id] ? (
          <>
            <h3>🧺 {o.name}</h3>

            <p><b>Service:</b> {o.service}</p>
            <p><b>Kilo:</b> {o.kilo}kg</p>
            <p><b>Payment:</b> {o.payment}</p>
            <p><b>Price:</b> ₱{o.price}</p>

            <p><b>Order Date:</b> {o.date}</p>

            <p><b>Claim Date:</b> {o.claimDate}</p>

            <p>
              <b>Status:</b>{" "}
              <span
                style={{
                  color:
                    o.status === "Completed"
                      ? "lime"
                      : "yellow",
                  fontWeight: "bold",
                }}
              >
                {o.status}
              </span>
            </p>

            {/* ACTION BUTTONS */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => editOrder(o)}
                style={{
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                ✏ Edit
              </button>

              <button
                onClick={() => deleteOrder(o.id)}
                style={{
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                🗑 Delete
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <h3>🙈 Order Hidden</h3>
          </div>
        )}
      </div>
    ))}
  </div>
)}
{active === "Customers" && (
  <div>

    {/* 👥 CUSTOMERS HEADER BOX */}
    <div
      style={{
        ...styles.card,
        background: "linear-gradient(135deg, #ff9eb3, #7ec8ff)",
        color: "#fff",
        marginBottom: "20px",
        textAlign: "center",
      }}
    >
      <h2>👥 Customers</h2>
      <p>Customer List & Search</p>
    </div>

    {/* 🔍 SEARCH BOX */}
    <div
      style={{
        ...styles.card,
        background: card,
        marginBottom: "20px",
      }}
    >
      <input
        type="text"
        placeholder="🔍 Search customer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />
    </div>

    {/* 👥 CUSTOMER BOXES */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "15px",
      }}
    >
      {customers.filter((c) =>
        c.toLowerCase().includes(search.toLowerCase())
      ).length > 0 ? (

        customers
          .filter((c) =>
            c.toLowerCase().includes(search.toLowerCase())
          )
          .map((c, i) => (
            <div
              key={i}
              onClick={() => setSelectedCustomer(c)}
              style={{
                ...styles.card,
                background:
                  selectedCustomer === c
                    ? "linear-gradient(135deg, #7ec8ff, #ff9eb3)"
                    : "linear-gradient(135deg, #ff9eb3, #7ec8ff)",
                color: "#fff",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <h3>👤 {c}</h3>
              <p>Click to view orders</p>
            </div>
          ))

      ) : (

        <div
          style={{
            ...styles.card,
            background: "linear-gradient(135deg, #ff9eb3, #7ec8ff)",
            color: "#fff",
            textAlign: "center",
            width: "100%",
          }}
        >
          <h3>❌ There is no customer found!</h3>
        </div>

      )}
    </div>

    {/* 📦 CUSTOMER ORDERS */}
    {selectedCustomer && (
      <div
        style={{
          ...styles.card,
          background: card,
          marginTop: "25px",
        }}
      >
        <h2>📦 Orders of {selectedCustomer}</h2>

        {orders
          .filter((o) => o.name === selectedCustomer)
          .map((o) => (
            <div
              key={o.id}
              style={{
                padding: "12px",
                borderBottom: "1px solid #ccc",
              }}
            >
              <b>{o.service}</b> — {o.kilo}kg
              <br />

              💰 ₱{o.price}
              <br />

              💳 {o.payment}
              <br />

              📅 Order: {o.date}
              <br />

              🧺 Claim: {o.claimDate}
              <br />

              Status:{" "}
              <span
                style={{
                  color:
                    o.status === "Completed"
                      ? "limegreen"
                      : "orange",
                  fontWeight: "bold",
                }}
              >
                {o.status}
              </span>
            </div>
          ))}
      </div>
    )}

  </div>
)}

{active === "Reports" && (
  <div>

    {/* 📄 REPORTS HEADER BOX */}
    <div
      style={{
        ...styles.card,
        background: "linear-gradient(135deg, #ff9eb3, #7ec8ff)",
        color: "#fff",
        marginBottom: "20px",
        textAlign: "center",
      }}
    >
      <h2>📄 Reports</h2>
      <p>Laundry Shop Summary & Analytics</p>
    </div>

    {/* 📊 REPORT BOXES */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "15px",
      }}
    >
      {/* TOTAL ORDERS */}
      <div
        style={{
          ...styles.card,
          background: "linear-gradient(135deg, #ff9eb3, #7ec8ff)",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <h4>📦 Total Orders</h4>
        <h1>{orders.length}</h1>
      </div>

      {/* TOTAL CUSTOMERS */}
      <div
        style={{
          ...styles.card,
          background: "linear-gradient(135deg, #ff9eb3, #7ec8ff)",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <h4>👥 Total Customers</h4>
        <h1>{customers.length}</h1>
      </div>

      {/* PENDING */}
      <div
        style={{
          ...styles.card,
          background: "linear-gradient(135deg, #ff9eb3, #7ec8ff)",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <h4>🕒 Pending</h4>
        <h1>{pendingCount}</h1>
      </div>

      {/* TOTAL INCOME */}
      <div
        style={{
          ...styles.card,
          background: "linear-gradient(135deg, #ff9eb3, #7ec8ff)",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <h4>💰 Total Income</h4>
        <h1>₱{totalBalance}</h1>
      </div>
    </div>

    {/* 🗑 CLEAR DATA BUTTON */}
    <button
      onClick={async () => {
        const confirmDelete = window.confirm(
          "⚠ Are you sure you want to clear all data?"
        );

        if (confirmDelete) {
          try {
            const snapshot = await getDocs(collection(db, "orders"));

            const deletePromises = snapshot.docs.map((document) =>
              deleteDoc(doc(db, "orders", document.id))
            );

            await Promise.all(deletePromises);

            alert("✅ All data cleared successfully!");
          } catch (error) {
            console.log(error);
            alert("❌ Failed to clear data.");
          }
        } else {
          alert("❎ Clear data cancelled.");
        }
      }}
      style={{
        ...styles.button,
        marginTop: "25px",
      }}
       >
      🗑 Clear Data
    </button>
  </div>
)}
      </div>
    </div>
  );
}

/* COMPONENT */
function Card({ title, value, bg }) {
  return (
    <div style={{ ...styles.card, background: bg }}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}
/* STYLES */
const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Segoe UI, sans-serif",
  },

  /* ================= SIDEBAR ================= */
  sidebar: {
    width: "240px",
    padding: "25px 20px",
    background: "rgba(255,255,255,0.3)",
    backdropFilter: "blur(12px)",
    borderRight: "1px solid rgba(255,255,255,0.2)",
  },

  menuItem: {
    padding: "12px 15px",
    borderRadius: "12px",
    marginBottom: "10px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "500",
  },

  /* ================= MAIN ================= */
  main: {
    flex: 1,
    padding: "25px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  headerRight: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },

  toggle: {
    border: "none",
    borderRadius: "10px",
    padding: "6px 12px",
    cursor: "pointer",
    fontWeight: "500",
    background: "#eee",
  },

  /* ================= DASHBOARD ================= */
  balanceCard: {
    padding: "25px",
    borderRadius: "18px",
    background: "linear-gradient(135deg, #ff9eb3, #7ec8ff)",
    color: "#fff",
    marginBottom: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
  },

  card: {
    padding: "20px",
    borderRadius: "18px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
    transition: "0.3s",
  },

  /* ================= FORM ================= */
  input: {
    width: "100%",
    padding: "10px 12px",
    margin: "8px 0",
    borderRadius: "10px",
    border: "1px solid #ddd",
    outline: "none",
    fontSize: "14px",
  },

  button: {
    padding: "10px",
    width: "100%",
    border: "none",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #ff9eb3, #7ec8ff)",
    color: "#fff",
    cursor: "pointer",
    marginTop: "10px",
    fontWeight: "600",
    transition: "0.3s",
  },

  /* ================= LOGIN ================= */
  loginContainer: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  loginBox: {
    background: "#fff",
    padding: "30px",
    borderRadius: "18px",
    textAlign: "center",
    width: "270px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },
};