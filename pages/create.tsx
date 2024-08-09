import React, { useEffect, useState } from 'react';
import { Input } from '../components/ui/input';
import { ethers } from 'ethers';
import {LLGIFTCONTRACT ,LLGIFTABI,LLABI,LLCONTRACT }from "../contracts/abi"
import { sign } from 'crypto';
import { useAccount } from 'wagmi';
const Form = () => {
  const [checked, setChecked] = useState(false);
  const [addrarray, setAddrArray] = useState(['']);
  const [addr, setAddr] = useState('');
  const [name, setName] = useState('');
  const [maximumbounty, setMaximumBounty] = useState(null);
  const [bounty, setBounty] = useState(null);
 const {isConnected ,address} = useAccount();
 const [entryfee,setentryfee]= useState(null);


//     const provider = new ethers.providers.JsonRpcProvider('https://gwan-ssl.wandevs.org:46891');
//     const signer = provider.getSigner();
// //   @ts-ignore
// const contract = new ethers.Contract(LLGIFTCONTRACT,LLGIFTABI,signer);

const [contract, setContract] = useState(null);
const[contract2,setContract2]=useState(null);

useEffect(() => {
    // @ts-ignore 
  if (typeof window.ethereum !== 'undefined') {
      // Create a Web3Provider, which wraps the Ethereum-compatible JavaScript object
    //   @ts-ignore 
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Request the user's accounts
    //   @ts-ignore 
      window.ethereum.request({ method: 'eth_requestAccounts' }).then(() => {
          // Get the signer
          const signer = provider.getSigner();

          // Now use the signer to interact with the contract
          const contractInstance = new ethers.Contract(LLGIFTCONTRACT, LLGIFTABI, signer);
          const contractInstance2 = new ethers.Contract(LLCONTRACT ,LLABI,signer);

          // Update state with the contract instance
        //   @ts-ignore 
          setContract(contractInstance);
                  //   @ts-ignore 

          setContract2(contractInstance2);
          
          // Now you can call methods on `contract` to interact with your smart contract.
        //   @ts-ignore 
      }).catch(error => {
          console.error('User denied account access');
      });
  } else {
      console.error('No Ethereum-compatible browser detected');
  }
}, []); 

async function fetchConstant() {
    // @ts-ignore 
    if(contract){
        // @ts-ignore 
    const creatorRewardPercentage = await contract.privateEnvelopes(0);
    console.log('Creator Reward Percentage:', creatorRewardPercentage.toString());
}
  }
  
  fetchConstant();


  const handleCheckboxChange = () => {
    setChecked(!checked);
  };

  const handleAddressChange = (index: number, value: string) => {
    const updatedArray = [...addrarray];
    updatedArray[index] = value;
    setAddrArray(updatedArray);
  };

  const handleAddAddress = () => {
    setAddrArray([...addrarray, '']);
  };

  async function onSubmit(e:any){
    e.preventDefault();
    // @ts-ignore
    if(!checked){
    try {
    // @ts-ignore 
        const valueToSend = ethers.utils.parseEther(bounty);  // Sending 1 ether
    
        // Send transaction
        // @ts-ignore 
        const tx = await contract.createPrivateEnvelope(name, addrarray, { value: valueToSend });
        console.log('Transaction sent:', tx.hash);
    
        // Wait for transaction to be mined
        const receipt = await tx.wait();
        console.log('Transaction confirmed');

     // @ts-ignore 
         const currentid = await contract.currentEnvelopeId();
         console.log(currentid)
//   @ts-ignore 
         window.alert(`your gift claim link for all the recipients: https://lottolux.vercel.app/privenvelopes/`+ parseInt( currentid._hex ,16 ));
      } catch (error) {
        console.error('Error:', error);
      }
    }else{
      try{
          // @ts-ignore 

      const valuetosend = ethers.utils.parseEther(bounty);
              // @ts-ignore 

      const tx = await contract2.createLottery(name,ethers.utils.parseEther(entryfee),valuetosend,{ value : valuetosend });
      console.log('Transaction successfull',tx.hash);
      window.alert(`public lotto has been created`);
      }catch(err){
        console.log(err);
      }


    }
  }

  return (
    <div className='min-h-screen p-20 bg-gradient-to-r from-teal-400 via-purple-500 to-indigo-600'>
    <div className='bg-gradient-to-r from-gray-800 to-gray-600 bg-opacity-40 p-10 rounded-lg shadow-2xl max-w-lg mx-auto font-mono'>
      <div className='flex flex-col space-y-6'>
        <h1 className='text-center font-extrabold text-2xl text-white'>
          {checked ? 'Lotto' : 'Lux Gift'}
        </h1>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="hidden"
            checked={checked}
            onChange={handleCheckboxChange}
          />
          <div className="w-12 h-6 bg-gray-400 rounded-full relative">
            <span
              className={`${checked ? "bg-green-400 translate-x-6" : "bg-gray-600"} block w-6 h-6 rounded-full absolute top-0 left-0 transition-transform duration-300`}
            ></span>
          </div>
        </label>
  
        <div className='flex flex-col space-y-3'>
          <h3 className='text-white font-semibold'>Name Your Lux Gift/Lottery</h3>
          <Input
            onChange={(e) => setName(e.target.value)}
            placeholder='Satoshi Nakamoto'
            className='p-3 border-2 rounded text-gray-800 bg-white'
          />
        </div>
        <div className='flex flex-col space-y-3 text-white'>
          <h3 className='font-semibold'>Amount</h3>
          <Input
            onChange={(e) => setBounty(e.target.value)}
            placeholder='$ 1000'
            className='p-3 border-2 rounded text-gray-800 bg-white'
            type='number'
          />
        </div>
        {!checked ? (
          <div className='flex flex-col space-y-3 text-white'>
            <h3 className='font-semibold'>Enter the Receiver Address</h3>
            <ul className='space-y-3'>
              {addrarray.map((address, index) => (
                <li key={index} className='flex items-center space-x-3'>
                  <Input
                    value={address}
                    placeholder='0x588797393fu8393209'
                    onChange={(e) => handleAddressChange(index, e.target.value)}
                    className='p-3 border-2 rounded flex-grow text-gray-800 bg-white'
                  />
                  <button
                    onClick={() => {
                      const updatedArray = [...addrarray];
                      updatedArray.splice(index, 1);
                      setAddrArray(updatedArray);
                    }}
                    className='p-3 bg-red-600 text-white rounded w-12'
                  >
                    x
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={handleAddAddress}
              className='p-3 bg-green-500 text-white rounded'
            >
              Add Address
            </button>
          </div>
        ) : (
          <div>
            <h3 className='text-white font-semibold'>Enter the Entry Fees</h3>
            <Input
              onChange={(e) => setentryfee(e.target.value)}
              placeholder='1 WAN'
              className='p-3 border-2 rounded flex-grow text-gray-800 bg-white mt-4'
              type='number'
            />
          </div>
        )}
        <button className='p-3 bg-yellow-500 text-black rounded-xl' onClick={onSubmit}>Submit</button>
      </div>
    </div>
  </div>
  
  );
};

export default Form;