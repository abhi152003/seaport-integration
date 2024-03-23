'use client';

import { Seaport } from "@opensea/seaport-js";
import { ethers } from "ethers";
import { ItemType } from "@opensea/seaport-js/lib/constants";
import { useState } from "react";

const SeaportIntegration = () => {
  const [order, setOrder] = useState(null);
  const offerToken = "0x45cc23c87767Bb1B04E916EEc2b7ccbD82c90a9d";
  const considerationToken = "0xf3FfD66A6Eb91a973917688CE56375768f754db5";
  const offerIdentifier = "4";
  const considerationIdentifier = "0";
  const amount = "1";  // If ItemType is ERC20 or ERC721 or ERC1155 then the value should be in integer and if it's a native token then it can be in decimal

  const handleSellerClick = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const seaport = new Seaport(provider);

      const signer = provider.getSigner();
      const accountAddress = await signer;

      const {address} = accountAddress
      const offerer = address;

      const { executeAllActions } = await seaport.createOrder(
        {
          offer: [
            {
              itemType: ItemType.ERC1155,
              token: offerToken,
              identifier: offerIdentifier,
            },
          ],
          consideration: [
            {
              itemType: ItemType.ERC20,
              token: considerationToken,
              identifier: considerationIdentifier,
              amount: ethers.parseEther(amount).toString(),
              recipient: offerer,
            },
          ],
        },
        offerer
      );

      const order = await executeAllActions();
      setOrder(order);
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
      const accountAddress = await signer;

      const {address} = accountAddress

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