import React,{useState,useEffect} from 'react'
import { Button, Header, Form, Icon } from 'semantic-ui-react'
import  FormError  from "../forms/FormError"
import { Link, useNavigate } from 'react-router-dom'
import { LoginUser } from '../api/api'
import FormSuccess from '../forms/FormSuccess'



function Login() {
  const [form,setForm]= useState({});
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [errorMessage, setError] = useState(null)
  const [successMessage, setSuccess] = useState(null)
  const navigate = useNavigate()
    
    
    useEffect(() => {
        if (data?.status === 200) {
          // console.log("here")
          // console.log(data)
          window.localStorage.setItem("token", data?.data.tokens.access);
          setSuccess({"responsestatusText":"Login in successful","detail":`Welcome, ${data.data.username}`})
          setTimeout(()=>{
            
            navigate("/home",{state:{"user":data.data},replace:true})
          },2000)

        }
        
    }, [data,navigate])

    function handleLogin(e) {
        e.preventDefault()
        setLoading(true)
        LoginUser(form,setData,setError);
        setLoading(false)
        setForm({});  
         
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
                        {successMessage?FormSuccess(successMessage):""}
                          <Form.Input type="Email" label="Email" fluid name='email' placeholder='Enter your email' value={form.email||""} onChange={onchange}/>  
                          <Form.Input type='Password' name='password' label='password'placeholder='Enter your password' value={form.password||""} onChange={onchange}/>
                        <Button disabled={loginFormInvalid} fluid loading={loading} primary type='submit'>Login</Button>
                    </Form>
                    <Header as="h4">Dont have an account? <Link to="/signup">Sign Up</Link></Header>
            </div>
    )
}

export default Login