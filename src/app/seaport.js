'use client';

import { Seaport } from "@opensea/seaport-js";
import { ethers } from "ethers";
import { ItemType } from "@opensea/seaport-js/lib/constants";

const SeaportIntegration = () => {
  const handleButtonClick = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const seaport = new Seaport(provider);

      const signer = provider.getSigner();
      console.log((await signer).getAddress)
      const accountAddress = await signer;

      const {address} = accountAddress

      const offerer = "0x160BCEdf12B4eE894a8f0faE0156e99f533ad534";
      const fulfiller = "0xB5204aff106dc1Ffc6bE909c94a6A933081dB636";
      const { executeAllActions } = await seaport.createOrder(
        {
          offer: [
            {
              itemType: ItemType.ERC721,
              token: "0x931F2B0c88ca40975C379d1147CB142C6034716c",
              identifier: "5",
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

      console.log("adresss::::::::::::: ",address)

      const { executeAllActions: executeAllFulfillActions } =
        await seaport.fulfillOrder({
          order,
          accountAddress: fulfiller,
        });

      const transaction = executeAllFulfillActions();
      console.log("Transaction:", transaction);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Execute Seaport Order</button>
    </div>
  );
};

export default SeaportIntegration;