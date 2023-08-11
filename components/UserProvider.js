"use client"


import { Store } from '@/app/layout'
import React, { useContext, useEffect } from 'react'


const UserProvider = ({child}) => {
        const {user,setUser}= useContext(Store)



        

        useEffect(()=>{






            
        },[])



  return (
    <>
    {child}

    
    </>
      
   
  )
}

export default UserProvider
