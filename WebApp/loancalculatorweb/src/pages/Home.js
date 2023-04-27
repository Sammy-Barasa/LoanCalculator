import React,{useEffect, useState} from 'react'
import {GetLoanProduct} from "../api/api"
import { Grid, Card, Label, Form,List, Segment,Menu,Icon,Select, Button } from 'semantic-ui-react'
import {EvaluateLoanProduct} from '../api/api'
import { useNavigate,useLocation } from 'react-router-dom'
const options = [
  { key: 'f', text: 'Flat rate', value: 'flat' },
  { key: 'r', text: 'Reduced rate', value: 'reduced' },
]

const options2 = [
  { key: 'm', text: 'Monthly', value: 'monthly' },
  { key: 'q', text: 'Quarterly', value: 'quarterly' },
  { key: 's', text: 'Semi- annually', value: 'semi-annually' },
  { key: 'a', text: 'Annually', value: 'annually' },
]


function Home() {
  const [loanproducts,setLoanProducts]=useState([])
  const [form, setFormData]=useState({})
  const [timevalue, setTimeValue]=useState("m")
  const [selectedproducts,setSelectedProducts]=useState([])
  const [dataresults, setData ] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [user, setUserAgain] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(()=>{
    GetLoanProduct(setLoanProducts)
  },[])

  useEffect(()=>{
    const user = location.state?.user;
    setUserAgain(user)

  },[location.state?.user])

  useEffect(() => {
    if (dataresults?.status === 200) {
      // console.log("here")
      // console.log(dataresults.data)
      setFormData({});
      // setSuccess({"responsestatusText":"Signup is successful","detail":`${data.data.message}. Check your email for verification`})
      setTimeout(()=>{
      setData({})
      setLoading(false)
      alert("Evaluation complete, redirecting")
      let tempevaluated=[]
      selectedproducts.map((sp,index)=>{
        let y =[]
        y=loanproducts.filter((lp)=>(lp.id=== sp))
        if(y.length!==0){
          tempevaluated.push(y[0])
          y=[]
        }
        return y
      })
      // console.log(tempevaluated)
      navigate("/results",{state:{"selectedevaluated":selectedproducts,"evaluated":tempevaluated,"evaluation":dataresults.data,"user":user}})
      },2000)
    }
    
    
}, [dataresults,navigate,user,selectedproducts,loanproducts])

useEffect(() => {
  // if (dataresults?.status === 200) {
  //   console.log("here")
    // console.log(error)
    setLoading(false)
    // setFormData({});
    // // setSuccess({"responsestatusText":"Signup is successful","detail":`${data.data.message}. Check your email for verification`})
    // setTimeout(()=>{
    // setData({})
    // },2000)
  // }
  
  
}, [error])

 const handleChange = (e) =>{ 
    e.preventDefault()
    setFormData({ ...form, [e.target.name]: e.target.value });
    // console.log(form)
  }

  const handleRadioChange = (e,{value}) =>{ 
    e.preventDefault()
    setTimeValue(value)
    // console.log(timevalue)
  }

  const handleSelect = (e,{value}) =>{ 
    e.preventDefault()
    // console.log(value)

    const len_in = selectedproducts.length
    let newnum = []
    // console.log(selectedproducts)
    newnum = selectedproducts.filter((num) => num !== value);

    let len_after = newnum.length
    // console.log(newnum)
    if (len_in === len_after) {
      // If number is already present, remove it
      // console.log("not there")
      setSelectedProducts([...selectedproducts,value])
      // console.log("added")
      // console.log(selectedproducts)
      
    } else {
      // console.log("already there")
      setSelectedProducts(selectedproducts.filter((num) => num !== value))
      // console.log("removed")
      // console.log(selectedproducts)
    }
}

const handleEvaluateRequest = (e)=>{
  e.preventDefault()
  let calibrated_period = 0
  if(timevalue==="m"){
    calibrated_period= form.loan_period
  }else if(timevalue==="y"){
    calibrated_period= form.loan_period*12
  }

  let requestdata = {
                      "loan_product":selectedproducts,
                      "amount":parseInt(form.amount),
                      "payment_frequency":form.payment_frequency,
                      "loan_period": parseInt(calibrated_period),
                      "start_date": form.start_date,
                      "interest_type":"flat"
                    }
    // console.log(requestdata)
    setLoading(true)
    EvaluateLoanProduct(requestdata,setData,setError)
    

    
}

const requestFormInvalid = selectedproducts.length<1 || !form.amount || !form.payment_frequency || !form.start_date || !form.loan_period;

  return (
    <div className='App-home'>
        <h4>Entere your loan details here</h4>
        <div>
         <Form loading={loading}>
        <Form.Group widths='equal'>
          <Form.Input label='Loan Amount' placeholder='loan amount' type='number' required name="amount" value={form.amount||""} onChange={handleChange}/>
          <Form.Input label='Payment Period' placeholder='payment period' type='number' name="loan_period" value={form.loan_period||""} onChange={handleChange} required />
          
          <Form.Field required>
          <label>
          Type of interest
            </label>
            <Select
            label='Type of interest'
            options={options}
            placeholder='interest type'
            onChange={(e,{value})=>{
              e.preventDefault()
              setFormData({ ...form, "interest_type": value });
              // console.log(form)
            }}
          />
          </Form.Field>
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Input label='Payment start date' placeholder='start date' type='date' name="start_date" value={form.start_date||""} onChange={handleChange} required/>
        
            <Form.Radio
              label='years'
              name='radioGroup'
              value="y"
              checked={timevalue==='y'}
              onChange={handleRadioChange}
            />
            <Form.Radio
              label='months'
              name='radioGroup'
              value="m"
              checked={timevalue ==="m"}
              onChange={handleRadioChange}
            />
            <Form.Field required>
            <label>
            Payment frequency
            </label>
            <Select
              options={options2}
              placeholder='instalment payment frequency'
              onChange={(e,{value})=>{
                e.preventDefault()
                setFormData({ ...form, "payment_frequency": value });
                // console.log(form)
              }}
            />
            </Form.Field>
         
        </Form.Group>
        <h4>Select loan products for evaluation </h4>
        <div>
          <Menu compact>
            <Menu.Item as='a'>
              <Icon name='mail' /> Selected products
              <Label color='green' floating>
                {selectedproducts.length}
              </Label>
            </Menu.Item>
          {selectedproducts.length>0?(<Menu.Item as='a'>
            <Icon name='users' /> Serial No. for selected products
            <Label color='teal' floating>
          {`${selectedproducts}`}
          </Label>
          </Menu.Item>):""}
          </Menu>
        </div>
        
        
      </Form>
    </div>
        <h4>Loan Products Avaiable</h4>
        <div>
        <List horizontal>
          {loanproducts.map((product,index)=>{
              return(<List.Item key={index} value={product.id} onClick={handleSelect}>
              <Grid>
                <Grid.Column>
                  <Segment raised>
                    <Label as='a' color='red' ribbon>
                      {product.loan_name}
                    </Label>
                    <span>{`Loan Product Detail  SNo. ${product.id}`}</span>

                    {/* <Image src='/images/wireframe/paragraph.png' /> */}

                    <Card>
                      <Card.Content>
                        {/* <Card.Header>Matthew Harris</Card.Header> */}
                        <Card.Meta><p>{`${product.bank.bank_name} bank`}</p></Card.Meta>
                        <Card.Description>
                          <p>{`Flat rate: ${product.flat_rate}%`}</p>
                          <p>{`reduced rate: ${product.reducing_balance_rate}%`}</p>
                        </Card.Description>
                      </Card.Content>
                    </Card>
                  </Segment>
                </Grid.Column>
              </Grid>
            </List.Item>)
          })}
        </List>
      </div>
      <div>
    
        <Button type='button' loading={loading} disabled={requestFormInvalid} onClick={handleEvaluateRequest}positive>Evaluate Prospective Loans</Button>
      </div>  
    </div>
  )
}

export default Home
