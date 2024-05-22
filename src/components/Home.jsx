import React from 'react'
import TableCont from './TableCont'

const Home = () => {
  return (
    <div className=' md:w-auto sm:w-auto w-auto  xl:w-auto lg:w-auto h-full flex-col flex items-center justify-center gap-y-7 pb-5'>

      <div className=' w-[95%] bg-white rounded-lg p-3 shadow-2xl'>
      <div className='rounded-lg h-48 bg-sky-600 text-6xl flex justify-center items-center text-white font-semibold'>
        Admin Dashboard
      </div>
      </div>
      <TableCont />
    </div>
  )
}

export default Home