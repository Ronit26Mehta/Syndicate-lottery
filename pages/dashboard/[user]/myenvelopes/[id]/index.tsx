import React from 'react'
import { useRouter } from 'next/router';


const Index = () => {
  const router = useRouter();
  const { user,id } = router.query;

  return (
    <div className='h-auto w-full'>
      {user}
      {id}
    </div>
  )
}

export default Index