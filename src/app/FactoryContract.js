'use client';
import { useState } from 'react'
import './page.module.css'
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import abi from './FactoryABI.json';

function FactoryContract() {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [supply, setSupply] = useState('');
  const [initialOwner, setInitialOwner] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    // const providerUrl = "https://sepolia.mode.network";
    // const provider = new ethers.JsonRpcProvider(providerUrl);
    // const signer = provider.getSigner();
    // const contractAddress = '0x8777aBf4446E8F57e0D14955035584832877D31a';
    // const contract = new ethers.Contract(contractAddress, abi, signer);

    // const tx = await contract.connect(wallet).createCollection(name, symbol, initialOwner, supply);
    // await tx.wait();

    const contractAddress = '0x8590839765a5976aF65A13eFB50971Fade9088d2'

    // Check if the user has MetaMask installed
    if (!window.ethereum) {
      alert('Please install MetaMask to use this feature');
      return;
    }

    // Request access to the user's MetaMask account
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, abi, signer);

    const tx = await contract.createERC721Collection(name, symbol, initialOwner, supply);
    const receipt = await tx.wait();
    console.log("Transaction mined : ", receipt.transactionHash)

    // Here you can submit the data
    console.log('Name:', name);
    console.log('Symbol:', symbol);
    console.log('Supply:', supply);
    console.log('Price:', price);
  };

  return (
    <div className='factory'>
        Create Collection
        <form onSubmit={handleSubmit}>
            <br/>
            <input placeholder='Name' value={name} onChange={(e) => setName(e.target.value)}/>
            <br/>
            <br/>
            <input placeholder='Symbol' value={symbol} onChange={(e) => setSymbol(e.target.value)}/>
            <br/>
            <br/>
            <input placeholder='Initial Owner' value={initialOwner} onChange={(e) => setInitialOwner(e.target.value)}/>
            <br/>
            <br/>
            <input placeholder='Max Supply' value={supply} onChange={(e) => setSupply(e.target.value)}/>
            <br/>
            <br/>
            <button type="submit">Submit</button>
        </form>
    </div>
  )
}

export default FactoryContract