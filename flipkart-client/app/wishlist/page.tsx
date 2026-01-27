"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getWishlistItems } from "../redux/productSlice";
import { useRouter } from "next/navigation";

import "./cart.css";
import { Button } from "@mui/material";

function Wishlist() {
  const dispatch = useDispatch<any>();
  const router = useRouter();

  const cartItems = useSelector((state: any) => state.productor.wishlist);
  const currentUser = useSelector((state: any) => state.authenticator.c_user);
  console.log("ui", cartItems);

  useEffect(() => {
    dispatch(getWishlistItems(Number(currentUser.userid)));
  }, [currentUser]);

  return (
    <div className="cart">
      <h1> Your Wishlist</h1>

      {cartItems?.length === 0 ? (
        <p>No items in wishlist</p>
      ) : (
        <>
          {cartItems?.map((item: any) => (
            <div className="cart-item" key={item.id}>
              <div className="cart-details">
                <img src={item.imageUrls[0]} className="cart-img" />
                <h3>{item.productname}</h3>
              </div>
            </div>
          ))}
        </>
      )}

      <Button onClick={() => router.push("/dashboard")}>Home</Button>
    </div>
  );
}

export default Wishlist;
