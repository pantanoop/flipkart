"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { increaseQty, decreaseQty, clearCart } from "../redux/productSlice";
import { useRouter } from "next/navigation";
import { placeOrder } from "../redux/orderSlice";
import { saveAddress } from "../redux/addressSlice";
import AddressModal from "../components/AddressModal";
import "./Cart.css";
import { Button, TextField } from "@mui/material";
import { findDiscountCoupoun } from "../redux/coupounSlice";

function Cart() {
  const dispatch = useDispatch<any>();
  const router = useRouter();

  const cartItems = useSelector((state: any) => state.productor.cart);
  const currentUser = useSelector((state: any) => state.authenticator.c_user);
  const currentDiscount = useSelector((state: any) => state.coupoun.discount);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [coupoun_value, setCoupoun_value] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState("");

  const totalPrice = cartItems.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0,
  );

  let discountPrice;

  if (currentDiscount === "10%") {
    discountPrice = totalPrice - totalPrice * 0.1;
  } else if (currentDiscount === "30%") {
    discountPrice = totalPrice - totalPrice * 0.3;
  } else if (currentDiscount === "50%") {
    discountPrice = totalPrice - totalPrice * 0.5;
  } else {
    discountPrice = totalPrice;
  }

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
      discountApplied: currentDiscount,
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

  function handleApplyCoupoun() {
    dispatch(findDiscountCoupoun({ coupoun_name: coupoun_value }));
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">🛒 Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="empty-cart">No items in cart</p>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item: any) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-left">
                  <img src={item.image} className="cart-img" />
                  <div className="cart-info">
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
                </div>

                <h4 className="cart-price">
                  $ {(item.price * item.quantity).toFixed(2)}
                </h4>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            {currentDiscount && (
              <p className="discount-text">
                Discount Applied {currentDiscount}
              </p>
            )}

            <h2>Total: $ {discountPrice?.toFixed(2)}</h2>

            <div className="coupon-box">
              <TextField
                label="ApplyDiscount"
                value={coupoun_value}
                onChange={(e) => setCoupoun_value(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                color="success"
                onClick={handleApplyCoupoun}
              >
                Apply Coupon
              </Button>
            </div>

            {!addressSaved && (
              <Button variant="contained" onClick={handlePlaceOrder} fullWidth>
                Buy
              </Button>
            )}

            {addressSaved && !orderPlaced && (
              <Button
                variant="contained"
                color="success"
                onClick={handleBuyNow}
                fullWidth
              >
                Proceed to Buy
              </Button>
            )}

            {orderPlaced && (
              <h3 className="success-text">✅ Order placed successfully!</h3>
            )}

            {error && <p className="error-text">{error}</p>}
          </div>
        </>
      )}

      <Button className="home-btn" onClick={() => router.push("/dashboard")}>
        Home
      </Button>

      <AddressModal
        open={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSave={handleSaveAddress}
      />
    </div>
  );
}

export default Cart;
