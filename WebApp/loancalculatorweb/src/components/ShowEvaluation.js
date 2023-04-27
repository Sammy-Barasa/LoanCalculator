import React from 'react'
import {  Card,Container,Button } from 'semantic-ui-react'
import TotalsBarChart from "./ChartGraphs/TotalsBarChart"
// import LoanDougnut from './ChartGraphs/LoanDougnut';
// import LoanDon from './ChartGraphs/LoanDon';
function ShowEvaluation({selectedids,evaluatedproducts}) {
    // console.log(selectedids) 
    // console.log(evaluatedproducts)
   const Data = {"principle": 30000,
        "payment_frequency": "monthly",
        "loan_period": 12,
        "type_interest": "flat",
        "number": 2,
        "total_payable": [
            46003.6,
            45703.6
        ],
        "interest": [
            6000.0,
            5700.000000000001
        ]}

       let Ksh = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'Ksh',
        });

   const SummaryPart = ()=>(
    <Card fluid>
            <Card.Content>
            <Card.Meta as="p">Summary</Card.Meta>
            <div className='show-summary'>
            <Button
                content='Principle Amount'
                // icon='heart'
                label={{ as: 'p', basic: true, content: `${Ksh.format(Data.principle)}`}}
                labelPosition='right'
            />
            <Button
                content='Payment Period'
                // icon='heart'
                label={{ as: 'p', basic: true, content: `${Data.loan_period} months`}}
                labelPosition='right'
            />
            <Button
                content='Interest Type'
                // icon='heart'
                label={{ as: 'p', basic: true, content: `${Data.type_interest} rate`}}
                labelPosition='right'
            />
            {/* </div>
            <br/>
            <div className='show-summary'> */}
            <Button
                content='Number of Installments'
                // icon='heart'
                label={{ as: 'p', basic: true, content: `${Data.number}`}}
                labelPosition='right'
            />
            <Button
                content='Installment Amount'
                // icon='heart'
                
                label={{ as: 'a', basic: true, content: `${Ksh.format(Data.principle)}`}}
                labelPosition='right'
            /> 
            <Button
                content='Comparing'
                // icon='heart'
                
                label={{ as: 'a', basic: true, content: `${Data.number} products`}}
                labelPosition='right'
            /> 
            </div>
        </Card.Content>
        </Card>
   )
   

  let bargraphdata = {"name": "Total payable Amount","principle":parseInt(Data.principle)}
  let bargraphdataaxis = ["principle",]
  
  selectedids.map((sid,index)=>{
    let y =[]
    y=evaluatedproducts.filter((lp)=>(lp.id === sid))
    if(y.length!==0){
      let pd=y[0]
      bargraphdata[pd.bank.bank_name] = parseInt(Data.total_payable[index])
      bargraphdataaxis.push(pd.bank.bank_name)
      y=[]
    }
    return y
  })

  // const data = [
  //   bargraphdata,
  // ];
  // const data = [
  //   { name: 'Group A', value: 400 },
  //   { name: 'Group B', value: 300 },
  //   { name: 'Group C', value: 300 },
  //   { name: 'Group D', value: 200 },
  // ];
 
  return (
    <div className='show'>
        {/* <h4>Show Evaluation Data</h4> */}
        <Container>
        {<SummaryPart/>}
        <Card fluid>
        <Card.Content>
        <Card.Meta as="p">Graphs</Card.Meta>
        {<TotalsBarChart data={[bargraphdata,]} axisdata ={bargraphdataaxis}/>}
        {/* {<LoanDougnut data={data}/>} */}
        {/* {<LoanDon/>} */}
        </Card.Content>
        </Card>
        <h4>Instalment Table</h4>
        </Container>
    </div>
  )
}

export default ShowEvaluation