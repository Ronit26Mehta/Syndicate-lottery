import React from 'react'
import {LLCONTRACT  ,LLABI} from "../contracts/abi"
import { ethers } from 'ethers';
import { useState,useEffect } from 'react';


const Listingmain = () => {
    const [contract2,setcontract2]=useState(null);
    const [envelopes, setEnvelopes] = useState([]);
    const provider = new ethers.providers.JsonRpcProvider('https://gwan-ssl.wandevs.org:46891');
    const contract = new ethers.Contract(LLCONTRACT ,LLABI,provider);

    const fetchEnvelopes = async () => {
      try {
        
  
        // Call the getAllEnvelopes function
        const result = await contract.getAllLotteries();
        console.log(result);
  
        // Unpack the result into arrays
        const ids = result[0];
        const names = result[1];
        const potSizes = result[2];
        const entryFees = result[3];
  
        // Combine the data into an array of objects
        // @ts-ignore
        const envelopeData = ids.map((id, index) => ({
          id: id,
          name: names[index],
          potSize: potSizes[index],
          entryFee: entryFees[index],
        }));
  
        setEnvelopes(envelopeData);
      } catch (error) {
        console.error('Error fetching data from the smart contract:', error);
      }
    };
    useEffect(() => {
                      //   @ts-ignore 

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
                const contractInstance = new ethers.Contract(LLCONTRACT , LLABI, signer);
                              //   @ts-ignore 

                setcontract2(contractInstance);
                
                // Now you can call methods on `contract` to interact with your smart contract.
              //   @ts-ignore 
            }).catch(error => {
                console.error('User denied account access');
            });
        } else {
            console.error('No Ethereum-compatible browser detected');
        }
        fetchEnvelopes();
        
      }, []);
                              {/* @ts-ignore */}

      const handlesubmit = async(e: any,idnew,fee) =>{
        e.preventDefault();
        try{
                          //   @ts-ignore 

            await contract2.purchaseTicket(idnew, {value: fee});
        }catch(error){
            console.log(error);
        }

     
      }
                                //   @ts-ignore 

      async function distribute(e:any,id) {
        e.preventDefault();
        try{
                   //   @ts-ignore 
                   const tx = await  contract2.distributePrizes(id)
                   console.log('Transaction successfull',tx.hash);
                   window.alert(`rewards distributed`);
        }catch(error){
            alert("You are not authrouzied to Distribute this particular reward")
        }
        
      }
  return (
    <div>
    <p className='text-[30px] text-center'>Monte Carlo pool</p>

    <div className='mainlisting'>
  {envelopes.slice(2).map((envelope, index) => (
    // @ts-ignore
    <div className='containerlisting' key={index}>

      {/* @ts-ignore */}
      <p className='text-[40px] text-center'>{envelope.name.toString()}</p>
      {/* @ts-ignore */}
      <h2>Base Bounty {ethers.utils.formatEther(envelope.potSize.toString())} WAN</h2>
      {/* @ts-ignore */}
      <h2>Entry Fee {ethers.utils.formatEther(envelope.entryFee.toString())} WAN</h2>
      <div className='flex flex-col align-middle justify-center pt-5'>
        {/* @ts-ignore */}
        <div className='pb-2'>
          {/* @ts-ignore */}
          <button 
            className='bg-zinc-300 text-black rounded-xl ml-40 p-[0.3rem]' 
            onClick={(e) => handlesubmit(e, envelope.id, envelope.entryFee)}
          >
            Submit
          </button>
        </div>
        {/* @ts-ignore */}
        <button 
          className='bg-red-500 text-white rounded-xl w-max self-center p-[1rem]' 
          onClick={(e) => distribute(e, envelope.id)}
        >
          Distribute your Rewards from the Lottery Pool
        </button>
      </div>

    </div>
  ))}
</div>

    
  </div>
  )
}

export default Listingmain