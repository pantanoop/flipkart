"use client";

import React, { useState } from "react";
import "./AddressModal.css";

interface Address {
  houseNo: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (address: Address) => void;
}

export default function AddressModal({ open, onClose, onSave }: Props) {
  const [address, setAddress] = useState<Address>({
    houseNo: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
  });

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const { houseNo, area, city, state, pincode } = address;
    if (!houseNo || !area || !city || !state || !pincode) {
      alert("Please fill all address fields");
      return;
    }
    onSave(address);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Save Delivery Address</h2>

        <input name="houseNo" placeholder="House No" onChange={handleChange} />
        <input name="area" placeholder="Area" onChange={handleChange} />
        <input name="city" placeholder="City" onChange={handleChange} />
        <input name="state" placeholder="State" onChange={handleChange} />
        <input name="pincode" placeholder="Pincode" onChange={handleChange} />

        <div className="modal-actions">
          <button onClick={onClose} className="cancel">
            Cancel
          </button>
          <button onClick={handleSave} className="confirm">
            Save Address
          </button>
        </div>
      </div>
    </div>
  );
}
