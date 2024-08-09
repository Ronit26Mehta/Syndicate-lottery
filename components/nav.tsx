import React, { useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { BMCONTRACT,BMABI ,LLGIFTABI,LLGIFTCONTRACT,LLCONTRACT ,LLABI} from '@/contracts/abi';
import { ethers } from 'ethers';
import Link from 'next/link';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useIsMounted } from '../hooks/useIsMounted';
function Nav() {
  const {isConnected,address} = useAccount();
  const mounted = useIsMounted();
  const provider = new ethers.providers.JsonRpcProvider('https://gwan-ssl.wandevs.org:46891');
  const contract = new ethers.Contract(LLGIFTCONTRACT,LLGIFTABI,provider);
  const contractpub = new ethers.Contract(LLCONTRACT ,LLABI,provider);
  const [credits,setCredits] = useState(null)
  const [creditsPub,setCreditsPub] = useState(null)
  useEffect(() => {
    async function check(){

        try {
            const check = await contract.userBalances(address);
            const checkpub = await contractpub.userBalances(address);
            console.log(check)
            // @ts-ignore 
        console.log(parseInt(check._hex,16))
         // @ts-ignore 
            setCredits(parseInt(check._hex,16)/10**18)
            // @ts-ignore
            setCreditsPub(parseInt(checkpub._hex,16)/10**18)
           
            
          } catch (error) {
            console.error('Error:', error);
          }

}
if(address )
  check();
  }, [address]);
  return (
    <div className='flex flex-row justify-between h-[60px] items-center p-[10px] bg-opacity-20 bg-white backdrop-blur-md border border-gray-200 rounded'>
     <Link href="/"> 
{mounted?
     <h1 className=''>
       
        <p>Syndicate-Lottery</p>
        
      </h1>:""}
      </Link>   
        <div className='flex flex-row gap-[1rem]   '>
          {/* <div className='text-center'>credits private:{credits != null ?credits:"-"}</div> */}
          <div className='text-center'>total Syndicate:{creditsPub != null ?(creditsPub+credits):"-"}</div>
        <ConnectButton chainStatus="icon"/>
        </div>
    </div>
  )
}

export default Nav;