import React,{useEffect,useState} from 'react'
import {  Card,Container,Button,Tab } from 'semantic-ui-react'
import TotalsBarChart from "./ChartGraphs/TotalsBarChart"
import ExportModal from "./ExportModal"

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

// import LoanDougnut from './ChartGraphs/LoanDougnut';
// import LoanDon from './ChartGraphs/LoanDon';
function ShowEvaluation({selectedids,evaluatedproducts,Data}) {
    // console.log(selectedids) 
    // console.log(evaluatedproducts)

      const [activeIndex, setActiveIndex]=useState(0) 
      const [statedata, setStateData]=useState([]) 
       let Ksh = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'Ksh',
        });

        const columns = [
          {"id":0,"align":"left","minWidth":170,"label":"Date"},
          {"id":0,"align":"right","minWidth":170,"label":"Loan"},
          {"id":0,"align":"right","minWidth":170,"label":"Installment"},
          {"id":0,"align":"right","minWidth":170,"label":"Remaining"},
        ]
        
        const [page, setPage] = React.useState(0);
        const [rowsPerPage, setRowsPerPage] = React.useState(10);

        const handleChangePage = (event, newPage) => {
          setPage(newPage);
        };

        const handleChangeRowsPerPage = (event) => {
          setRowsPerPage(+event.target.value);
          setPage(0);
        };
        useEffect(()=>{
          // setStateData(Object.values(Data.instalment_table[index-1]))
        },[])

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
    
    temp["render"] = ()=>(<Tab.Pane attached={false} key={index}>{<>
      <TableContainer component={Paper}>
      <div className='show-modal-div'><Button basic value={activeIndex}>Tap tab name to see table</Button><ExportModal data={Object.values(Data.instalment_table[index-1])} label_name={tb} product_title={producttitles[index-1]}/></div>
      {/* <Table>
        <Table.Header>
        <Table.Row>
        <Table.HeaderCell >Date</Table.HeaderCell>
          <Table.HeaderCell >Loan</Table.HeaderCell>
          <Table.HeaderCell >Installment</Table.HeaderCell>
          <Table.HeaderCell >Remaining</Table.HeaderCell>
        </Table.Row>
      </Table.Header> */}
      <Table sx={{ minWidth: 650 }} size="small" stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            {/* <TableCell>Date</TableCell>
            <TableCell align="right">Loan</TableCell>
            <TableCell align="right">Installment</TableCell>
            <TableCell align="right">Remaining</TableCell> */}
            {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>

        {/* {
          statedata.map((val,index)=>{
            return(
            // <Table.Row key={index}>
            //   <Table.Cell>{val.next_date}</Table.Cell>
            //   <Table.Cell>{val.loan}</Table.Cell>
            //   <Table.Cell>{val.installment}</Table.Cell>
            //   <Table.Cell>{val.remaining}</Table.Cell>
            // </Table.Row>
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {val.next_date}
              </TableCell>
              <TableCell align="right">{val.loan}</TableCell>
              <TableCell align="right">{val.installment}</TableCell>
              <TableCell align="right">{val.remaining}</TableCell>
            </TableRow>
            )
          })
        } */}

          {statedata
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((val) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={parseInt(val.remaining)}>
                    <TableCell component="th" scope="row">
                      {val.next_date}
                    </TableCell>
                    <TableCell align="right">{val.loan}</TableCell>
                    <TableCell align="right">{val.installment}</TableCell>
                    <TableCell align="right">{val.remaining}</TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={statedata.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      </>}
    </Tab.Pane>)
    panes.push(temp)
  }

  return temp
 })

 const handleTabChange = (e,{activeIndex})=>{
  e.preventDefault()
  console.log("tab changed")
  setActiveIndex(activeIndex)
  setStateData(Object.values(Data.instalment_table[activeIndex]))
  setPage(0)
  console.log(statedata)
 }

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
          {<Tab menu={{ secondary: true, pointing: true }} panes={panes} onTabChange={handleTabChange} activeIndex={activeIndex} defaultActiveIndex={1}/>}
          {/* {InstallmentsData} */}
        </Card.Content>
        </Card>
        </Container>
    </div>
  )
}

export default ShowEvaluation