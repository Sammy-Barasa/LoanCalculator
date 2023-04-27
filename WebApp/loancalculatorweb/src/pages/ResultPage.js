import React, { useState,useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ShowEvaluation from '../components/ShowEvaluation';

function ResultPage() {
    const [evaluateddata,setEvaluatedData]= useState(null)
    const [evaluatedproducts,setEvaluatedProducts]= useState(null)
    const [selectedids,setSelectedIds]= useState(null)
    const location = useLocation();


    useEffect(()=>{
        const rawdata = location.state?.evaluation;
        setEvaluatedData(rawdata)
        const selectedids = location.state?.selectedevaluated
        setSelectedIds(selectedids)
        const evaluatedproducts = location.state?.evaluated
        setEvaluatedProducts(evaluatedproducts)
        // console.log(location.state)
    
      },[location.state?.evaluation,location.state])
      
      // console.log(evaluateddata)
  return (
    <div>
        {/* <h4>Results Page</h4> */}
        {/* <p>Data visualization coming soon! graphs and charts, meanwhile ...</p> */}
        <br/>
        {/* <pre>{JSON.stringify(evaluateddata,null,20)}</pre> */}
        {evaluatedproducts?(<ShowEvaluation selectedids={selectedids} evaluatedproducts={evaluatedproducts} Data={evaluateddata}/>):""}
    </div>
  )
}

export default ResultPage