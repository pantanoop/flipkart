"use client";

// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { getWishlistItems } from "../redux/productSlice";
// import { useRouter } from "next/navigation";

// import "./cart.css";
// import { Button } from "@mui/material";

// function Wishlist() {
//   const dispatch = useDispatch<any>();
//   const router = useRouter();

//   const cartItems = useSelector((state: any) => state.productor.wishlist);
//   const currentUser = useSelector((state: any) => state.authenticator.c_user);
//   console.log("ui", cartItems);

//   useEffect(() => {
//     dispatch(getWishlistItems(Number(currentUser.userid)));
//   }, [currentUser]);

//   return (
//     <div className="wishlist-container">
//       <h1 className="wishlist-title">❤️ Your Wishlist</h1>

//       {cartItems?.length === 0 ? (
//         <p className="empty-text">No items in wishlist</p>
//       ) : (
//         <div className="wishlist-grid">
//           {cartItems?.map((item: any) => (
//             <div className="wishlist-card" key={item.id}>
//               <img
//                 src={item?.imageUrls?.[0]}
//                 className="wishlist-img"
//                 alt={item.productname}
//               />
//               <h3 className="wishlist-name">{item.productname}</h3>
//             </div>
//           ))}
//         </div>
//       )}

//       <Button
//         className="secondary-btn"
//         onClick={() => router.push("/dashboard")}
//       >
//         Home
//       </Button>
//     </div>
//   );
// }

// export default Wishlist;

"use client";

import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks/hooks";
import { getWishlistItems, removeFromWishlist } from "../redux/productSlice";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import "./cart.css";

function Wishlist() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const wishlistItems = useAppSelector((state) => state.productor.wishlist);
  const currentUser = useAppSelector((state) => state.authenticator.c_user);

  useEffect(() => {
    if (currentUser?.userid) {
      dispatch(getWishlistItems(Number(currentUser.userid)));
    }
  }, [currentUser]);

  const handleRemove = (productid: number) => {
    if (!currentUser) {
      alert("Please login to add items to your wishlist");
      return;
    }
    dispatch(
      removeFromWishlist({
        productid,
        userid: currentUser.userid,
      }),
    );
  };

  return (
    <div className="wishlist-container">
      <h1 className="wishlist-title">❤️ Your Wishlist</h1>

      {wishlistItems?.length === 0 ? (
        <p className="empty-text">No items in wishlist</p>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((item: any) => (
            <div className="wishlist-card" key={item.productid}>
              <img
                src={item.imageUrls?.[0] || "/placeholder.png"}
                className="wishlist-img"
                alt={item.productname}
              />
              <h3 className="wishlist-name">{item.productname}</h3>
              <button
                className="remove-btn"
                onClick={() => handleRemove(item.productid)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <Button
        className="secondary-btn"
        onClick={() => router.push("/dashboard")}
      >
        Home
      </Button>
    </div>
  );
}

export default Wishlist;
