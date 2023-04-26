import React,{useEffect, useState} from 'react'
import {GetLoanProduct} from "../api/api"


function Home() {
  const [loanproducts,setLoanProducts]=useState([])
  useEffect(()=>{
    GetLoanProduct(setLoanProducts)
  },[])
  return (
    <div className='App-home'>
        <p>Home Page</p>
        <h3>Loan Products</h3>
        <ul>
          {loanproducts.map((product,index)=>{
            return(<li key={index}>{product.loan_name}</li>)
          })}
        </ul>
        
    </div>
  )
}

export default Home
