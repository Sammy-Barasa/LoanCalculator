import React,{useState} from 'react'
import { Button, Form , Header, Icon} from 'semantic-ui-react'
import { RegisterUser } from '../api/api'
import  FormError  from "../forms/FormError"

function Signup() {
  const [form,setForm]= useState({});
  const [data,setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [errorMessage, setError] = useState({})
  
  
  function handleRegister(e) {
    e.preventDefault()
    delete form.confirmpassword
    setLoading(true)
    RegisterUser(form,setData,setError);
    setLoading(false)
    setForm({});
    console.log(data)
  }

  const onchange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
  }; 
const registerFormInvalid =
form?.password!==form?.confirmpassword||!form?.email?.length || !form.password || !form.password.length;
  return (
    <div className='register-form'>
            <Icon.Group size="large">
              <Icon circular name="signup" color="teal"/>
              <Icon corner loading name="setting" color="grey"/>
            </Icon.Group>
            
            <Header as="h4">Create an account</Header>
                <Form success warning onSubmit={handleRegister}> 
                
                    {errorMessage?FormError(errorMessage):""}
                    <Form.Group widths='equal'>
                        <Form.Input type="Email" name='email' label="Email" autofocus required placeholder='Enter your email' value={form.email||""} onChange={onchange}/>
                        <Form.Input type="text" name='username' label='Username' required  placeholder='Enter your username' value={form.username||""} onChange={onchange}/>
                      </Form.Group> 
                      <Form.Group widths='equal'>
                        <Form.Input type='Password' name='password' label='Password'required placeholder='Enter your password' value={form.password||""} onChange={onchange}/>
                        <Form.Input type='Password' name='confirmpassword' label='Confirm password' required placeholder='Confirm your password' value={form.confirmpassword||""} onChange={onchange}/>
                        </Form.Group>
                    <Button disabled={registerFormInvalid} loading={loading} fluid primary type='submit'>Register</Button>
                    <p></p>
                </Form>
        </div>
  )
}

export default Signup