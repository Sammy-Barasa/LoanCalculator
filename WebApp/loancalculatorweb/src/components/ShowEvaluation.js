import React from 'react'
import {  Card,Container,Button,Tab,Table } from 'semantic-ui-react'
import TotalsBarChart from "./ChartGraphs/TotalsBarChart"
import ExportModal from "./ExportModal"
// import LoanDougnut from './ChartGraphs/LoanDougnut';
// import LoanDon from './ChartGraphs/LoanDon';
function ShowEvaluation({selectedids,evaluatedproducts,Data}) {
    // console.log(selectedids) 
    // console.log(evaluatedproducts)
        
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
                label={{ as: 'p', basic: true, content: `${Data.number_of_installments}`}}
                labelPosition='right'
            />
            <Button
                content='Payment frequency'
                // icon='heart'
                
                label={{ as: 'a', basic: true, content: `${Data.payment_frequency}`}}
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
  let interestgraphdata = {"name": "Interest Amount"}
  let bargraphdataaxis = ["principle",]
  let producttitles = []
  
  selectedids.map((sid,index)=>{
    let y =[]
    y=evaluatedproducts.filter((lp)=>(lp.id === sid))
    if(y.length!==0){
      let pd=y[0]
      bargraphdata[`${pd.bank.bank_name}_${pd.loan_name}`] = parseInt(Data.total_payable[index])
      bargraphdataaxis.push(`${pd.bank.bank_name}_${pd.loan_name}`)
      interestgraphdata[`${pd.bank.bank_name}_${pd.loan_name}`] = parseInt(Data.installment_amount[index])
      producttitles.push(pd.loan_name)
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
  let panes = []
 bargraphdataaxis.map((tb,index)=>{
  
  let temp = {}
  if(index===0){
  }else{
    temp["menuItem"]= tb
    temp["render"] = ()=>(<Tab.Pane attached={false}>{<>
      <Container>
      <div className='show-modal-div'><ExportModal data={Object.values(Data.instalment_table[index-1])} label_name={tb} product_title={producttitles[index-1]}/></div>
      <Table>
        <Table.Header>
        <Table.Row>
          <Table.HeaderCell >Loan</Table.HeaderCell>
          <Table.HeaderCell >Installment</Table.HeaderCell>
          <Table.HeaderCell >Remaining</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
        <Table.Body>
        {/* {Data.instalment_table[index-1].map((inst,index)=>{
          return(<><p>{`${inst}`}</p> </>)
        })} */}
        {/* {console.log(Data.instalment_table[index-1].forEach(item,index)=>{
          console.log(item)
        })} */}
        {/* {Object.values(Data.instalment_table[index-1]).forEach((val,index) => */}
          {/* (<Table.Row key={index}> */}
          {/* <Table.Cell>{val.loan}</Table.Cell>
          <Table.Cell>{val.installment}</Table.Cell>
          <Table.Cell>{val.remaining}</Table.Cell> */}
          {/* {console.log(val)} */}
        {/* </Table.Row>))} */}
        </Table.Body>
      </Table>
      </Container></>}
    </Tab.Pane>)
    // console.log(temp)
    panes.push(temp)
  }
  return temp
 })
  return (
    <div className='show'>
        {/* <h4>Show Evaluation Data</h4> */}
        <Container>
        {<SummaryPart/>}
        <Card fluid>
        <Card.Content>
        <Card.Meta as="p">Graphs</Card.Meta>
        {<TotalsBarChart data={[bargraphdata,]} axisdata ={bargraphdataaxis}/>}
        {<TotalsBarChart data={[interestgraphdata,]} axisdata ={bargraphdataaxis}/>}
        {/* {<LoanDougnut data={data}/>} */}
        {/* {<LoanDon/>} */}
        </Card.Content>
        </Card>
  
        <Card fluid>
        <Card.Content>
          <Card.Meta>Installment Table</Card.Meta>
          {<Tab menu={{ secondary: true, pointing: true }} panes={panes} />}
          {/* {InstallmentsData} */}
        </Card.Content>
        </Card>
        </Container>
    </div>
  )
}

export default ShowEvaluation