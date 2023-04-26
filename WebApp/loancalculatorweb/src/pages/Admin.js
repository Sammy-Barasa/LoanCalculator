import React,{useState,useEffect} from 'react'
import { List,Label } from 'semantic-ui-react'
// import { Label, Menu,Tab,Icon } from 'semantic-ui-react'
import {  ref, onValue} from "firebase/database";
import {db} from '../firebase';
import ExportModal from "../components/ExportModal"


function Admin() {
    const [EvaluationData, setEvaluationData] = useState([]);
    useEffect(()=>{
        const query = ref(db, `EvaluationData`);
        let valuationvals = []
        onValue(query, (snapshot) => {
          const data = snapshot.val();
          if (snapshot.exists()) {
            Object.values(data).map((EvaluationInfo) => {
              // console.log(DeviceData)
              return valuationvals.push(EvaluationInfo)
            });
          }
        });
    
        setEvaluationData(()=>(valuationvals))
      },[EvaluationData?.length])
  return (
    <div>
        <h3>Admin</h3>
        <div className='tab-bar-1'>
              <h3>Evaluation Log <Label color='blue'>{`  ${EvaluationData.length}`}</Label></h3>
              <ExportModal data={EvaluationData}/>
        </div>
        <List divided relaxed>
          <List.Header>
                <div className='admin-title'> 
                  <p>Principle  Amount</p>
                  <p>Payment Frequency</p>
                  <p>Loan Period Yrs</p>
                  <p>No. of Products</p>
                  <p>Loan Interest Type</p>
                  <p>Amount Payable</p>
                  <p>Interest Payable</p>
                </div>
          </List.Header>
          {console.log(EvaluationData)}
          {EvaluationData.map((datalog,index)=>{
            // let datefrom = new Date(parseInt(datalog.time *1000))
            // let dateTodisplay = datefrom.toLocaleDateString('en-US',{
            //     day:'numeric',
            //     month:'short',
            //     year:'numeric'
            // })

            // let timefrom = new Date(parseInt(datalog.time * 1000))
            // let timeTodisplay = timefrom.toLocaleTimeString()    
    
            return(
              <List.Item key={index}>
                <List.Content>
                <div className='list-content-admin'> 
                  <p>{datalog.principle}</p>
                  <p>{datalog.payment_frequency}</p>
                  <p>{datalog.loan_period}</p>
                  <p>{datalog.number}</p>
                  <p>{datalog.type_interest}</p>
                  <p>{datalog.total_payable}</p>
                  <p>{datalog.interest_rates}</p>
                </div>
                </List.Content>
              </List.Item>)
          })}
          </List>
    </div>
  )
}

export default Admin