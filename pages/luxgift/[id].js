import React from 'react'
import { useState,useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { useIsMounted } from '../../hooks/useIsMounted';
import { ethers } from 'ethers';
import {LLGIFTCONTRACT ,LLGIFTABI} from "../../contracts/abi"

function Luxgift() {
    const router = useRouter();
    const [conn,setConn] = useState(false);
    const [loading,setLoading] = useState(true);
    const [eligible,setEligible] = useState(false);
    const {isConnected,address} = useAccount();
    const [claimAmt,setClaimAmt] = useState(0);
    const { id } = router.query;
    const mounted = useIsMounted();
    const provider = new ethers.providers.JsonRpcProvider('https://gwan-ssl.wandevs.org:46891');
    const contract = new ethers.Contract(LLGIFTCONTRACT,LLGIFTABI,provider);
    useEffect(() => {
        if (mounted) {
          setConn(isConnected);
        }
      }, [mounted, isConnected]);
      useEffect(() => {
        async function check(){
    
            try {
                const check = await contract.isRecipient(address,id);
                console.log(check)
                if(check)
                 setEligible(true)
                 
                setLoading(false)
                
              } catch (error) {
                console.error('Error:', error);
              }

    }
    if(address && id)
      check();
      }, [address,id]);
    

      async function claimEnvelope() {
        try {
          // Check for Ethereum provider
          if (typeof window.ethereum !== 'undefined') {
            // Create a Web3Provider
            const provider = new ethers.providers.Web3Provider(window.ethereum);
      
            // Request the user's accounts
            await window.ethereum.request({ method: 'eth_requestAccounts' });
      
            // Get the signer
            const signer = provider.getSigner();
      
            // Create a contract instance
            const contract = new ethers.Contract(LLGIFTCONTRACT, LLGIFTABI, signer);
      
            // Call claimPrivateEnvelope
            const tx = await contract.claimPrivateEnvelope(id);
            console.log('Transaction sent:', tx.hash);
      
            // Wait for the transaction to be mined
            const receipt = await tx.wait();
            console.log('Transaction confirmed:', receipt.transactionHash);
      console.log(receipt)
            // If the PrivateEnvelopeClaimed event is emitted, it can be accessed in the receipt.events array
            const event = receipt.events?.find(e => e.event === 'PrivateEnvelopeClaimed');
            if (event) {
                const envelopeIdHex = event.args[0]._hex;
                const claimerAddress = event.args[1];
                const claimableAmountHex = event.args[2]._hex;
            console.log(claimableAmountHex);
            console.log(claimerAddress)
            console.log(envelopeIdHex)
                // Convert hex to BigNumber instances
                const envelopeId = ethers.BigNumber.from(envelopeIdHex);
                const claimableAmount = ethers.BigNumber.from(claimableAmountHex);
            
                console.log('Envelope ID:', envelopeId.toString());
                console.log('Claimer Address:', claimerAddress);
                console.log('Claimable Amount:', ethers.utils.formatUnits(claimableAmount, 'ether'));
                setClaimAmt(ethers.utils.formatUnits(claimableAmount, 'ether'))
            }
            
          } else {
            console.error('No Ethereum-compatible browser detected');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    if(!conn)
    return (
        <div>connect your wallet please</div>
      )

      if(loading)
      return (
        <div>checking eligibility...</div>
      )

      if(!eligible)
      return (
        <div>you are not eligible!</div>
      )
      
  return (
    <div className=' text-white flex flex-col gap-[2rem] justify-center items-center h-auto p-[2rem]' style={{ background: 'linear-gradient(to right, #B59676, #8B0000)' }} >
    {/* envelope id : {id} {mounted ? (isConnected ? "connected" : "disconnected") : "not mounted"} */}
    
    {!claimAmt && <button onClick={claimEnvelope} className='p-2 bg-blue-500 text-black rounded-xl w-[30%]'>claim</button>}
    
    <div className=" w-60 h-auto">
    {claimAmt ? (
            <div  className="w-16 h-16 rounded-full bg-gradient-to-br from-white to-gray-200 flex items-center justify-center mb-1 text-black">
               {`your claim amount:`} {claimAmt } 
            </div>
           
        ):<div></div>}
        <img src={claimAmt ? "/envopen.png" : "/envclose.png"} width="60%" height="10%" className="w-full"  />
        
    </div>
</div>
  )
}

export default Luxgift