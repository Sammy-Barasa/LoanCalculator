import React,{useState,useEffect} from 'react'
import { Button, Header, Form, Icon,Divider } from 'semantic-ui-react'
import  FormError  from "../forms/FormError"
import { Link, useNavigate } from 'react-router-dom'
import { LoginUser, LoginUserSocial } from '../api/api'
import FormSuccess from '../forms/FormSuccess'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {provider} from "../firebase";



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

    function handleSocialLogin(){

      const auth = getAuth();
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          console.log(credential)
          // const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          // IdP data available using getAdditionalUserInfo(result)
          // ...
          console.log(user)
          LoginUserSocial(user,setData,setError);
        }).catch((error) => {
          // Handle Errors here.
          setError(error)
          console.log(error)
          // const errorCode = error.code;
          // const errorMessage = error.message;
          // The email of the user's account used.
          // const email = error.customData.email;
          // The AuthCredential type that was used.
          // const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
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
                    <Header as="h6">dont have an account? <Link to="/signup">sign up</Link></Header>
                    <Divider horizontal>or</Divider>
                    <Button  color="teal" onClick={handleSocialLogin}><Icon name="google"/>Login with google</Button>
                    <br/>    
            </div>
    )
}

export default Login