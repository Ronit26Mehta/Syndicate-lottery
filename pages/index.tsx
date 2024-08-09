import { NextPage } from 'next';
import React from 'react';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div style={{ background: 'linear-gradient(to right, #38b2ac, #805ad5, #5a67d8);'
    }}>
    <div className="flex flex-col justify-center items-center h-screen space-y-8 p-20">
      <div className="bg-gradient-to-r from-gray-800 via-black to-yellow-400 bg-opacity-60 p-10 rounded-lg shadow-2xl max-w-lg w-full flex flex-col items-center space-y-8
">
        <Link href="/create">
          <button className="text-xl h-20 w-80 font-mono shadow-2xl bg-[#B59676] hover:bg-[#8B0000] text-white font-bold py-2 px-4 rounded-2xl border border-gray-600 bg-opacity-90 transition-colors duration-300">
            Make a new Lotto
          </button>
        </Link>
        <Link href="/listingmain">
          <button className="text-xl h-20 w-80 font-mono shadow-2xl bg-[#B59676] hover:bg-[#8B0000] text-white font-bold py-2 px-4 rounded-2xl border border-gray-600 bg-opacity-90 transition-colors duration-300">
            Lotto Lux Arena
          </button>
        </Link>
      </div>
    </div>
  </div>
  

  );
};

export default Home;