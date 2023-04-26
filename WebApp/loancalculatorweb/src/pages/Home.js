import React,{useEffect, useState} from 'react'
import {GetLoanProduct} from "../api/api"
import { Grid, Card, Label, Form,List, Segment,Menu,Icon } from 'semantic-ui-react'

const options = [
  { key: 'f', text: 'Flat rate', value: 'flat' },
  { key: 'r', text: 'Reduced rate', value: 'reduced' },
]

const options2 = [
  { key: 'a', text: 'Annually', value: 'annually' },
  { key: 's', text: 'Semi- annually', value: 'semi-annually' },
  { key: 'q', text: 'Quarterly', value: 'quarterly' },
  { key: 'm', text: 'Monthly', value: 'monthly' },
]


function Home() {
  const [loanproducts,setLoanProducts]=useState([])
  const [form, setFormData]=useState({})
  const [timevalue, setTimeValue]=useState("m")
  const [selectedproducts,setSelectedProducts]=useState([])

  useEffect(()=>{
    GetLoanProduct(setLoanProducts)
  },[])

  

 const handleChange = (e) =>{ 
    e.preventDefault()
    setFormData({ ...form, [e.target.name]: e.target.value });
    console.log(form)
  }

  const handleRadioChange = (e,{value}) =>{ 
    e.preventDefault()
    setTimeValue(value)
    console.log(timevalue)
  }

  const handleSelect = (e,{value}) =>{ 
    e.preventDefault()
    console.log(value)

    const len_in = selectedproducts.length
    let newnum = []
    console.log(selectedproducts)
    newnum = selectedproducts.filter((num) => num !== value);

    let len_after = newnum.length
    console.log(newnum)
    if (len_in === len_after) {
      // If number is already present, remove it
      console.log("not there")
      setSelectedProducts([...selectedproducts,value])
      console.log("added")
      // console.log(selectedproducts)
      
    } else {
      console.log("already there")
      setSelectedProducts(selectedproducts.filter((num) => num !== value))
      console.log("removed")
      // console.log(selectedproducts)

    }
    

}
  // const {time_in} = timevalue
//   {
//     "loan_product": [
//         1
//     ],
//     "amount": 80000,
//     "payment_frequency": "quarterly",
//     "loan_period": 6,
//     "start_date": "2023-25-4",
//     "interest_type": "flat"
// }

  return (
    <div className='App-home'>
        <h4>Entere your loan details here</h4>
        <div>
         <Form>
        <Form.Group widths='equal'>
          <Form.Input label='Loan Amount' placeholder='loan amount' type='number' required name="amount" value={form.amount||""} onChange={handleChange}/>
          <Form.Input label='Payment Period' placeholder='payment period' type='number' name="loan_period" value={form.loan_period||""} onChange={handleChange} required />
          <Form.Select
            name="interest_type"
            label='Type of interest'
            options={options}
            placeholder='interest type'
            required
            onChange={handleChange}
          />
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
            <Form.Select
              name="payment_frequency"
              label='Payment frequency'
              options={options2}
              placeholder='instalment payment frequency'
              onChange={handleChange}
              required
            />
         
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
          <Menu.Item as='a'>
            <Icon name='users' /> Serial Numbers of selected products
            <Label color='teal' floating>
          {`${selectedproducts}`}
          </Label>
          </Menu.Item>
          </Menu>
        </div>
        
        <Form.Button type='button' fluid>Evaluate Prospective Loans</Form.Button>
      </Form>
    </div>
        <h4>Loan Products Avaiable</h4>
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
  )
}

export default Home
