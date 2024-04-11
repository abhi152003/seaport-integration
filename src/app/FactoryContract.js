'use client';
import { useEffect, useState } from 'react'
import './page.module.css'
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import abi from './FactoryABI.json';
import cloneableABI from './CloneableABI.json';
import { useQuery, gql } from '@apollo/client';
import client from './FactoryClient';
import './globals.css'

const GET_COLLECTION_ADDRESS = gql`
query ExampleQuery($where: ERC721CollectionCreated_filter) {
  erc721CollectionCreateds(where: $where) {
    collection
  }
}
`;

function FactoryContract() {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [supply, setSupply] = useState('');
  const [initialOwner, setInitialOwner] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('');
  const [mintAddress, setMintAddress] = useState('');
  const [tokenDescription, setTokenDescription] = useState('');
  const [id, setID] = useState('');

  useEffect(() => {
    const getInitialOwner = async () => {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setInitialOwner(address);
      }
    };

    getInitialOwner();
  }, []);

  console.log(initialOwner);

  const handleSubmit = async (event) => {
    event.preventDefault();
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

//    setInitialOwner(address);

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

  const {loading, error, data} = useQuery(GET_COLLECTION_ADDRESS, {
    variables : {
      "where": {
        "initialOwner": initialOwner,
      }
    },
    client,
    //skip: !id,
  })

  const handleCollectionClick = (collection) => {
    setSelectedCollection(collection);
  };

  const handleTokenSubmit = async (event) => {
    event.preventDefault();
    const contractAddress = selectedCollection

    if (!window.ethereum) {
      alert('Please install MetaMask to use this feature');
      return;
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, cloneableABI, signer);

    const tx = await contract.safeMint(mintAddress, tokenDescription);
    const receipt = await tx.wait();
    console.log("Transaction mined : ", receipt.transactionHash)
  }

  if(data) {
    console.log(data);
  }
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className='factory'>
      Create Collection
      <form onSubmit={handleSubmit}>
        <br />
        <input placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
        <br />
        <br />
        <input placeholder='Symbol' value={symbol} onChange={(e) => setSymbol(e.target.value)} />
        <br />
        <br />
        <input placeholder='Initial Owner' value={initialOwner} disabled />
        <br />
        <br />
        <input placeholder='Max Supply' value={supply} onChange={(e) => setSupply(e.target.value)} />
        <br />
        <br />
        <button type="submit">Submit</button>
      </form>
      {data && data.erc721CollectionCreateds.length > 0 && (
        <div>
          <h2>Created Collections:</h2>
          <div className='collection_list'>
            {data.erc721CollectionCreateds.map((item, index) => (
              <li key={index} onClick={() => handleCollectionClick(item.collection)}>
                {item.collection}
                {selectedCollection === item.collection && (
                  <div>
                    <h3>Mint Token</h3>
                    <form onSubmit={handleTokenSubmit}>
                      <input
                        placeholder='Address'
                        value={mintAddress}
                        onChange={(e) => setMintAddress(e.target.value)}
                      />
                      <br />
                      <br />
                      <input
                        placeholder='Token URI'
                        value={tokenDescription}
                        onChange={(e) => setTokenDescription(e.target.value)}
                      />
                      <br />
                      <br />
                      <button type="submit">Mint Token</button>
                    </form>
                  </div>
                )}
              </li>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FactoryContract