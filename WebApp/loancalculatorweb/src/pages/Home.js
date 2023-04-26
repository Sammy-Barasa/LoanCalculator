import React,{useEffect, useState} from 'react'
import {GetLoanProduct} from "../api/api"
import { Grid, Card, Label, List, Segment } from 'semantic-ui-react'


function Home() {
  const [loanproducts,setLoanProducts]=useState([])
  useEffect(()=>{
    GetLoanProduct(setLoanProducts)
  },[])
  return (
    <div className='App-home'>
        <h4>Entere your loan details here</h4>
        
        <h4>Loan Products Avaiable</h4>
        <List horizontal>
          {loanproducts.map((product,index)=>{
            return(<List.Item key={index}>
              <Grid>
                <Grid.Column>
                  <Segment raised>
                    <Label as='a' color='red' ribbon>
                      {product.loan_name}
                    </Label>
                    <span>Loan Product Details</span>

                    {/* <Image src='/images/wireframe/paragraph.png' /> */}

                    <Card>
                      <Card.Content>
                        {/* <Card.Header>Matthew Harris</Card.Header> */}
                        <Card.Meta><p>{`${product.bank} bank`}</p></Card.Meta>
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
