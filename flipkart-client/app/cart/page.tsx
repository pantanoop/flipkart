"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { increaseQty, decreaseQty, clearCart } from "../redux/productSlice";
import { useRouter } from "next/navigation";
import { placeOrder } from "../redux/orderSlice";
import { saveAddress } from "../redux/addressSlice";
import AddressModal from "../components/AddressModal";
import "./Cart.css";
import { Button } from "@mui/material";

function Cart() {
  const dispatch = useDispatch<any>();
  const router = useRouter();

  const cartItems = useSelector((state: any) => state.productor.cart);
  const currentUser = useSelector((state: any) => state.authenticator.c_user);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressSaved, setAddressSaved] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState("");

  const totalPrice = cartItems.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0,
  );

  const handlePlaceOrder = () => {
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setShowAddressModal(true);
  };

  const handleSaveAddress = async (address: any) => {
    const payload = {
      userid: currentUser.userid,
      ...address,
    };

    const result = await dispatch(saveAddress(payload));

    if (saveAddress.fulfilled.match(result)) {
      setAddressSaved(true);
      setShowAddressModal(false);
    } else {
      setError("Failed to save address");
    }
  };

  const handleBuyNow = async () => {
    const payload = {
      userid: currentUser.userid,
      items: cartItems.map((item: any) => ({
        productid: item.id,
        quantity: item.quantity,
      })),
    };

    const result = await dispatch(placeOrder(payload));

    if (placeOrder.fulfilled.match(result)) {
      dispatch(clearCart());
      setOrderPlaced(true);
    } else {
      setError("Order failed. Please try again.");
    }
  };

  return (
    <div className="cart">
      <h1>🛒 Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          {cartItems.map((item: any) => (
            <div className="cart-item" key={item.id}>
              <div className="cart-details">
                <img src={item.image} className="cart-img" />
                <h3>{item.productName}</h3>
                <p>$ {item.price}</p>

                <div className="cart-qty">
                  <button onClick={() => dispatch(decreaseQty(item.id))}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => dispatch(increaseQty(item.id))}>
                    +
                  </button>
                </div>
              </div>

              <h4>$ {(item.price * item.quantity).toFixed(2)}</h4>
            </div>
          ))}

          <h2>Total: $ {totalPrice.toFixed(2)}</h2>

          {!addressSaved && (
            <Button variant="contained" onClick={handlePlaceOrder}>
              Add Address
            </Button>
          )}

          {addressSaved && !orderPlaced && (
            <Button variant="contained" color="success" onClick={handleBuyNow}>
              Proceed to Buy
            </Button>
          )}

          {orderPlaced && (
            <h3 style={{ color: "green" }}>✅ Order placed successfully!</h3>
          )}

          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      )}

      <Button onClick={() => router.push("/dashboard")}>Home</Button>

      <AddressModal
        open={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSave={handleSaveAddress}
      />
    </div>
  );
}

export default Cart;
