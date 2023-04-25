import React,{useState} from 'react'
import { Button, Header, Form, Icon } from 'semantic-ui-react'
import  FormError  from "../forms/FormError"
import { Link } from 'react-router-dom'
import { LoginUser } from '../api/api'



function Login() {
  const [form,setForm]= useState({});
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({})
  const [errorMessage, setError] = useState({})
    
    
    
    // useEffect(() => {
    //     if (data?.status === 200) {
    //         console.log("to redirect")
    //     }
        
    // }, [data?.status])

    function handleLogin(e) {
        e.preventDefault()
        setLoading(true)
        LoginUser(form,setData,setError);
        setLoading(false)
        setForm({});
        console.log(data)
        
    }

    const onchange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    }; 
    const loginFormInvalid =
    !form?.email?.length || !form.password || !form.password.length;

  
    return (
            
            <div className='login-form'>
                    <Icon.Group size="large">
                      <Icon circular name='lock'color='teal'/>
                      <Icon corner loading name='sign-in' color='grey'/>
                    </Icon.Group>
                    <Header as="h4">Login to your account</Header>
                    <Form success warning onSubmit={handleLogin}> 
                        {errorMessage?FormError(errorMessage):""}
                          <Form.Input type="Email" label="Email" fluid name='email' placeholder='Enter your email' value={form.email||""} onChange={onchange}/>  
                          <Form.Input type='Password' name='password' label='password'placeholder='Enter your password' value={form.password||""} onChange={onchange}/>
                        <Button disabled={loginFormInvalid} fluid loading={loading} primary type='submit'>Login</Button>
                    </Form>
                    <Header as="h4">Dont have an account? <Link to="/signup">Sign Up</Link></Header>
            </div>
    )
}

export default Login