import { useEffect, useState } from "react"
import "./App.css"

type MenuItem = {
  id: number
  name: string
  category: string
  price: number
  available: boolean
}

type CartItem = {
  menuItemId: number
  name: string
  price: number
  quantity: number
  note: string
}

type Order = {
  id: number
  tableNumber: string
  orderType: string
  status: string
  paymentMethod?: string
  totalAmount: number
  aiKitchenSummary: string
  aiUpsellSuggestion: string
  items: {
    id: number
    itemName: string
    quantity: number
    note: string
    price: number
    subtotal: number
  }[]
}

type ActiveTab = "pos" | "kitchen" | "payments"

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("pos")
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [tableNumber, setTableNumber] = useState("1")
  const [orderType, setOrderType] = useState("DINE_IN")
  const [paymentMethod, setPaymentMethod] = useState("CASH")

  useEffect(() => {
    fetchMenu()
    fetchOrders()
  }, [])

  const fetchMenu = async () => {
    const response = await fetch("http://localhost:8080/api/menu")
    const data = await response.json()
    setMenu(data)
  }

  const fetchOrders = async () => {
    const response = await fetch("http://localhost:8080/api/orders")
    const data = await response.json()
    setOrders(data)
  }

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.menuItemId === item.id)

      if (existing) {
        return prev.map((cartItem) =>
          cartItem.menuItemId === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }

      return [
        ...prev,
        {
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          note: "",
        },
      ]
    })
  }

  const increaseQuantity = (menuItemId: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.menuItemId === menuItemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }

  const decreaseQuantity = (menuItemId: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.menuItemId === menuItemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const updateNote = (menuItemId: number, note: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.menuItemId === menuItemId ? { ...item, note } : item
      )
    )
  }

  const removeFromCart = (menuItemId: number) => {
    setCart((prev) => prev.filter((item) => item.menuItemId !== menuItemId))
  }

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const createOrder = async () => {
    if (cart.length === 0) {
      alert("Please add at least one item.")
      return
    }

    const payload = {
      tableNumber: orderType === "DINE_IN" ? tableNumber : "",
      orderType,
      items: cart.map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        note: item.note,
      })),
    }

    const response = await fetch("http://localhost:8080/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      alert("Failed to create order.")
      return
    }

    setCart([])
    await fetchOrders()
    setActiveTab("kitchen")
    alert("Order sent to kitchen.")
  }

  const updateStatus = async (orderId: number, status: string) => {
    await fetch(`http://localhost:8080/api/orders/${orderId}/status?status=${status}`, {
      method: "PATCH",
    })

    await fetchOrders()
  }

  const payOrder = async (orderId: number) => {
    await fetch(`http://localhost:8080/api/orders/${orderId}/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentMethod }),
    })

    await fetchOrders()
  }

  const kitchenOrders = orders.filter((order) =>
    order.status === "NEW" ||
    order.status === "PREPARING" ||
    (order.orderType === "TAKEAWAY" && order.status === "PAID")
  )

  const paymentOrders = orders.filter((order) =>
    order.status === "UNPAID" ||
    (order.status === "READY" && !order.paymentMethod)
  )

  const paidOrders = orders.filter((order) =>
    Boolean(order.paymentMethod)
  )

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>SmartCafe POS</h1>
          <p>AI-assisted POS for modern F&amp;B business</p>
        </div>

        <nav className="tabs">
          <button
            className={activeTab === "pos" ? "tab active" : "tab"}
            onClick={() => setActiveTab("pos")}
          >
            POS Counter
          </button>
          <button
            className={activeTab === "kitchen" ? "tab active" : "tab"}
            onClick={() => setActiveTab("kitchen")}
          >
            Kitchen Display
          </button>
          <button
            className={activeTab === "payments" ? "tab active" : "tab"}
            onClick={() => setActiveTab("payments")}
          >
            Payments
          </button>
        </nav>
      </header>

      {activeTab === "pos" && (
        <main className="pos-layout">
          <section className="panel">
            <div className="section-header">
              <div>
                <h2>Menu</h2>
                <p>Select items for the customer order.</p>
              </div>
            </div>

            <div className="menu-grid">
              {menu.map((item) => (
                <button
                  key={item.id}
                  className="menu-card"
                  onClick={() => addToCart(item)}
                  disabled={!item.available}
                >
                  <strong>{item.name}</strong>
                  <span>{item.category}</span>
                  <b>RM {Number(item.price).toFixed(2)}</b>
                </button>
              ))}
            </div>
          </section>

          <section className="panel cart-panel">
            <div className="section-header">
              <div>
                <h2>Current Cart</h2>
                <p>Create a dine-in or takeaway order.</p>
              </div>
            </div>

            <div className="form-row">
              <label>Order Type</label>
              <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                <option value="DINE_IN">Dine In</option>
                <option value="TAKEAWAY">Takeaway</option>
              </select>
            </div>

            {orderType === "DINE_IN" && (
              <div className="form-row">
                <label>Table No</label>
                <input
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                />
              </div>
            )}

            {cart.length === 0 ? (
              <div className="empty-state">
                <strong>No item selected yet.</strong>
                <p>Click any menu item to add it into cart.</p>
              </div>
            ) : (
              <div className="cart-list">
                {cart.map((item) => (
                  <div key={item.menuItemId} className="cart-item">
                    <div className="cart-top">
                      <div>
                        <strong>{item.name}</strong>
                        <p>RM {(item.price * item.quantity).toFixed(2)}</p>
                      </div>

                      <div className="qty-control">
                        <button onClick={() => decreaseQuantity(item.menuItemId)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => increaseQuantity(item.menuItemId)}>+</button>
                      </div>
                    </div>

                    <input
                      placeholder="Special note e.g. less sugar, no peanuts"
                      value={item.note}
                      onChange={(e) => updateNote(item.menuItemId, e.target.value)}
                    />

                    <button className="danger-btn" onClick={() => removeFromCart(item.menuItemId)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="checkout-box">
              <span>Total</span>
              <strong>RM {cartTotal.toFixed(2)}</strong>
            </div>

            <button className="primary-btn" onClick={createOrder}>
              Send Order to Kitchen
            </button>
          </section>
        </main>
      )}

      {activeTab === "kitchen" && (
        <main className="single-layout">
          <section className="panel">
            <div className="section-header">
              <div>
                <h2>Kitchen Display</h2>
                <p>Track active orders and update food preparation status.</p>
              </div>

              <button onClick={fetchOrders}>Refresh</button>
            </div>

            {kitchenOrders.length === 0 ? (
              <div className="empty-state">
                <strong>No active kitchen orders.</strong>
                <p>New orders will appear here after the cashier sends them.</p>
              </div>
            ) : (
              <div className="kitchen-grid">
                {kitchenOrders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-top">
                      <div>
                        <strong>Order #{order.id}</strong>
                        <p>
                          {order.orderType}
                          {order.tableNumber && ` - Table ${order.tableNumber}`}
                        </p>
                      </div>

                      <span className={`badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>

                    <ul className="order-items">
                      {order.items.map((item) => (
                        <li key={item.id}>
                          <strong>{item.quantity}x</strong> {item.itemName}
                          {item.note && <em> — {item.note}</em>}
                        </li>
                      ))}
                    </ul>

                    <div className="ai-box">
                      <strong>AI Kitchen Summary</strong>
                      <p>{order.aiKitchenSummary}</p>
                    </div>

                    <div className="actions">
                      {order.status === "NEW" && (
                        <button onClick={() => updateStatus(order.id, "PREPARING")}>
                          Start Preparing
                        </button>
                      )}

                      {order.status === "PAID" && order.orderType === "TAKEAWAY" && (
                        <button onClick={() => updateStatus(order.id, "PREPARING")}>
                          Start Preparing
                        </button>
                      )}

                      {order.status === "PREPARING" && (
                        <button onClick={() => updateStatus(order.id, "READY")}>
                          Mark as Ready
                        </button>
                      )}

                      {order.status === "READY" && order.orderType === "DINE_IN" && (
                        <button onClick={() => setActiveTab("payments")}>
                          Go to Payment
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      )}

      {activeTab === "payments" && (
        <main className="single-layout">
          <section className="panel">
            <div className="section-header">
              <div>
                <h2>Payments & Receipts</h2>
                <p>Complete payment for ready orders and review paid receipts.</p>
              </div>

              <div className="payment-method">
                <label>Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="CASH">Cash</option>
                  <option value="QR">QR</option>
                  <option value="CARD">Card</option>
                </select>
              </div>
            </div>

            <h3>Ready to Pay</h3>

            {paymentOrders.length === 0 ? (
              <div className="empty-state">
                <strong>No ready orders yet.</strong>
                <p>Kitchen must mark an order as READY before payment.</p>
              </div>
            ) : (
              <div className="payment-grid">
                {paymentOrders.map((order) => (
                  <div key={order.id} className="order-card receipt-card">
                    <div className="order-top">
                      <strong>Order #{order.id}</strong>
                      <span className={`badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>

                    <p>
                      {order.orderType}
                      {order.tableNumber && ` - Table ${order.tableNumber}`}
                    </p>

                    <ul className="order-items">
                      {order.items.map((item) => (
                        <li key={item.id}>
                          {item.quantity}x {item.itemName} — RM{" "}
                          {Number(item.subtotal).toFixed(2)}
                        </li>
                      ))}
                    </ul>

                    <div className="ai-box">
                      <strong>AI Upsell Suggestion</strong>
                      <p>{order.aiUpsellSuggestion}</p>
                    </div>

                    <div className="checkout-box">
                      <span>Total</span>
                      <strong>RM {Number(order.totalAmount).toFixed(2)}</strong>
                    </div>

                    <button className="primary-btn" onClick={() => payOrder(order.id)}>
                      Mark as Paid
                    </button>
                  </div>
                ))}
              </div>
            )}

            <h3>Paid Receipts</h3>

            {paidOrders.length === 0 ? (
              <p className="muted">No paid receipts yet.</p>
            ) : (
              <div className="receipt-list">
                {paidOrders.map((order) => (
                  <div key={order.id} className="receipt-row">
                    <div>
                      <strong>Receipt #{order.id}</strong>
                      <p>
                        {order.orderType}
                        {order.tableNumber && ` - Table ${order.tableNumber}`}
                      </p>
                    </div>

                    <div>
                      <strong>RM {Number(order.totalAmount).toFixed(2)}</strong>
                      <p>Paid by {order.paymentMethod}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  )
}

export default App