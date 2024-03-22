'use client';

import { Seaport } from "@opensea/seaport-js";
import { ethers } from "ethers";
import { ItemType } from "@opensea/seaport-js/lib/constants";
import { useState } from "react";

const SeaportIntegration = () => {
  const [order, setOrder] = useState(null);

  const handleSellerClick = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const seaport = new Seaport(provider);

      const signer = provider.getSigner();
      // console.log((await signer).getAddress)
      const accountAddress = await signer;

      const {address} = accountAddress
      console.log('addressssss', address);

      const offerer = address;
      const fulfiller = "0x21F44B7EF8AC550372bfbAb467F6Ad314717e10D";
      const { executeAllActions } = await seaport.createOrder(
        {
          offer: [
            {
              itemType: ItemType.ERC1155,
              token: "0x45cc23c87767Bb1B04E916EEc2b7ccbD82c90a9d",
              identifier: "0",
            },
          ],
          consideration: [
            {
              amount: ethers.parseEther("0.0001").toString(),
              recipient: offerer,
            },
          ],
        },
        offerer
      );

      const order = await executeAllActions();
      setOrder(order);
      console.log("adresss::::::::::::: ",address)

      // const { executeAllActions: executeAllFulfillActions } =
      //   await seaport.fulfillOrder({
      //     order,
      //     accountAddress: fulfiller,
      //   });

      // const transaction = executeAllFulfillActions();
      console.log("Order:", order);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleBuyerClick = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const seaport = new Seaport(provider);

      const signer = provider.getSigner();
      // console.log((await signer).getAddress)
      const accountAddress = await signer;

      const {address} = accountAddress
      console.log('addressssss', address);

      // const order = await executeAllActions();

      console.log("adresss::::::::::::: ",address)

      if (!order) {
        console.error("No order available. Please create an order first.");
        return;
      }

      const { executeAllActions: executeAllFulfillActions } =
        await seaport.fulfillOrder({
          order,
          accountAddress: address,
        });

      const transaction = executeAllFulfillActions();
      console.log("Transaction:", transaction);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div>
      <button onClick={handleSellerClick}>Seller</button>
      <button onClick={handleBuyerClick}>Buyer</button>
    </div>
  );
};

export default SeaportIntegration;