"use client";

import { CONTRACT_ADDRESS } from "@/constants";
import bulkTransferNft from "@/helper/bulkTransferNft";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [addressesString, setAddressesString] = useState("");

  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await bulkTransferNft(addressesString.split(","), privateKey, address);
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-5">
      <h1 className="text-6xl font-bold text-center">Bulk NFT Transfer</h1>
      <p className="text-2xl text-center">
        Contract Address: {CONTRACT_ADDRESS}
      </p>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter Your Address"
        className="border-2 border-gray-300 p-2 bg-transparent w-[500px]"
      ></input>
      <input
        type="text"
        value={privateKey}
        onChange={(e) => setPrivateKey(e.target.value)}
        placeholder="Enter Your Private Key"
        className="border-2 border-gray-300 p-2 bg-transparent w-[500px]"
      ></input>
      <textarea
        value={addressesString}
        onChange={(e) => setAddressesString(e.target.value)}
        placeholder="Enter Addresses (separated by comma)"
        className="border-2 border-gray-300 p-2 bg-transparent w-[500px] h-[200px]"
      ></textarea>
      <button
        onClick={handleClick}
        className="bg-blue-500 text-white p-2 rounded-md w-[250px]"
      >
        {loading ? "Loading..." : "Transfer"}
      </button>
    </main>
  );
}
