import React, { useState,useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ResultPage() {
    const [evaluateddata,setEvaluatedData]= useState(null)
    const location = useLocation();

    useEffect(()=>{
        const rawdata = location.state?.evaluation;
        setEvaluatedData(rawdata)
        console.log(location.state)
    
      },[location.state?.evaluation,location.state])

  return (
    <div>
        <h4>Results Page</h4>
        <p>Data visualization coming soon! graphs and charts, meanwhile ...</p>
        <pre>{JSON.stringify(evaluateddata,null,20)}</pre>
    </div>
  )
}

export default ResultPage