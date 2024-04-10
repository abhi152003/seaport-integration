'use client';

import { Seaport } from "@opensea/seaport-js";
import { ethers } from "ethers";
import { ItemType } from "@opensea/seaport-js/lib/constants";
import { useState } from "react";

const SeaportIntegration = () => {
  const [order, setOrder] = useState(null);
  const offerToken = "0x1d8152570189B00ddeec85Aa9a4e090a8Acf7342";
  const considerationToken = "0xf3FfD66A6Eb91a973917688CE56375768f754db5";
  const offerIdentifier = "0";
  const considerationIdentifier = "0";
  const amount = "0.03";  // If ItemType is ERC20 or ERC721 or ERC1155 then the value should be in integer and if it's a native token then it can be in decimal
  const [offerItemType, setOfferItemType] = useState(ItemType.ERC721); // Dynamic state for offer item type
  const [considerationItemType, setConsiderationItemType] = useState(ItemType.NATIVE);

  const handleSellerClick = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const seaport = new Seaport(provider);

      const signer = provider.getSigner();
      const accountAddress = await signer;

      const {address} = accountAddress
      const offerer = address;

      const fees = 0.025 * amount;
      const amountAfterFees = amount - fees;
      const feesRec = "0xba35722Ff8C8413f804dfA408c55181CCfB7F97B"

      const { executeAllActions } = await seaport.createOrder(
        {
          offer: [
            {
              itemType: offerItemType,
              token: offerToken,
              identifier: offerIdentifier,
            },
          ],
          consideration: [
            {
              //itemType: considerationItemType,
              //token: considerationToken,
              //identifier: considerationIdentifier,
              amount: ethers.parseEther((amountAfterFees).toString()).toString(),
              recipient: offerer,
            },
            {
              amount: ethers.parseEther((fees.toString())).toString(),
              recipient: feesRec
            }
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