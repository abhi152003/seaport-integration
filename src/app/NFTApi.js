'use client';
import React, { useState } from 'react';
import './globals.css';
import { useQuery, gql } from '@apollo/client';
import client from './ApolloClient';

import { Seaport } from "@opensea/seaport-js";
import { ethers } from "ethers";
import { ItemType } from "@opensea/seaport-js/lib/constants";

const GET_TOKEN_TRANSACTIONS = gql`
query MyQuery {
  trades(first: 10) {
    collection {
      sellerCount
      buyerCount
      id
      name
      nftStandard
      symbol
    }
  }
}
`;

function NFTApi() {
  const [address, setAddress] = useState('');
  const [data1, setData] = useState([]);
  const [nftAddress, setNftAddress] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [offerItemType, setOfferItemType] = useState(ItemType.ERC721);
  const [considerationItemType, setConsiderationItemType] = useState(ItemType.NATIVE);
  const [offerIdentifier, setOfferIdentifier] = useState('1');
  const [considerationIdentifier, setConsiderationIdentifier] = useState('')
  const [offerToken, setOfferToken] = useState('');
  const [amount, setAmount] = useState('');
  const [considerationToken, setConsiderationToken] = useState('');
  const [order, setOrder] = useState(null);

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
              itemType: considerationItemType,
              token: considerationToken,
              identifier: considerationIdentifier,
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

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  }

  const handleIdChange = (event) => {
    setOfferIdentifier(event.target.value);
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `https://sepolia.explorer.mode.network/api/v2/addresses/${address}/token-balances`
      );
      const data1 = await response.json();
      console.log(data1);
      setData(data1);
    } catch (error) {
      console.error('Error fetching token balances:', error);
    }
  };

  const handleIndexChange = (index) => {
    setSelectedIndex(index);
    const tokenData = data1[index]; // Access the token data at the specified index
    console.log(tokenData);
    if (tokenData) {
      setNftAddress(tokenData.token.address); 
      //console.log(tokenData.token.address);
      setOfferIdentifier(tokenData.token_id)      
      console.log(tokenData.token_id)
      setOfferToken(tokenData.token.address);
      //console.log(tokenData.token.type.replace('-', ''));
      setAmount(amount);
      setConsiderationToken(tokenData.token)
    }

    if(tokenData.token.type.replace('-', '') === 'ERC721') {
      setOfferItemType(ItemType.ERC721);
    } else if (tokenData.token.type.replace('-', '') === 'ERC1155') {
      setOfferItemType(ItemType.ERC1155)
    } else {
      setOfferItemType(ItemType.ERC20)
    }
  };

  const handleBuyClick = async () => {
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

  const { loading, error, data } = useQuery(GET_TOKEN_TRANSACTIONS, {
    variables: { id: nftAddress },
    client,
    skip: !nftAddress, // Skip the query if the address is empty
  });

  if(data) {
    console.log(data);
  }
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <input
        placeholder="Address"
        value={address}
        onChange={handleAddressChange}
      />
      <button onClick={handleSubmit}>Submit</button>
      <div>
        {data1.length > 0 ? (
        <ul>
            Total : {data1.length}
            <br />
            {data1.map((tokenData, index) => (
              <li key={tokenData.token_id || tokenData.token.address}>
                <button onClick={() => handleIndexChange(index)} className='nft'>
                  Name: {tokenData.token.name ?? 'NA'}, Symbol:{' '}
                  {tokenData.token.symbol ?? 'NA'}
                </button>
                {selectedIndex === index && (
                  <div className='nft_det'>
                    <p>Token ID: {tokenData.token_id ?? 'NA'}</p>
                    <p>Value: {tokenData.value ?? 'NA'}</p>
                    <p>Token Address: {tokenData.token.address ?? 'NA'}</p>
                    <p>Token Type: {tokenData.token.type ?? 'NA'}</p>
                    <p>Token Decimals: {tokenData.token.decimals ?? 'NA'}</p>
                    <input placeholder='price' value={amount} onChange={handleAmountChange} className='amount'></input>
                    {
                      tokenData.token.type === 'ERC-721' && (
                        <input placeholder='token id' value={offerIdentifier} onChange={handleIdChange}></input>
                      )
                    }
                    <button onClick={handleSellerClick}>Sell</button>
                  </div>
                )}
              </li>
            ))}
        </ul>
            ) : (
            <p>No token balances found.</p>
            )}
        </div>
        {order && (
          <div className='nft-buy'>
            <h2>Order Details</h2>
            <h3>Offer Items:</h3>
            {order.parameters.offer.map((offerItem, index) => (
              <div key={index}>
                <p>Item Type: {offerItem.itemType}</p>
                <p>Token Address: {offerItem.token}</p>
                <p>ID: {offerItem.identifierOrCriteria}</p>
              </div>
            ))}
            {order.parameters.consideration && order.parameters.consideration.length > 0 && order.parameters.consideration[0] ? (
              <div>
                <p>
                  startAmount: {ethers.formatUnits(order.parameters.consideration[0].startAmount, 'ether')}
                </p>
                <p>
                  endAmount: {ethers.formatUnits(order.parameters.consideration[0].endAmount, 'ether')}
                </p>
                <button onClick={handleBuyClick}>Buy</button>
              </div>
            ) : (
              <p>No consideration items found.</p>
            )}
          </div>
        )}
    </div>
  );
}

export default NFTApi;