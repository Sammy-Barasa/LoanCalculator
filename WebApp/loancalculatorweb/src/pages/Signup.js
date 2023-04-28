import React,{useState,useEffect} from 'react'
import { Button, Form , Header, Icon,Divider} from 'semantic-ui-react'
import { RegisterUser,RegisterUserSocial } from '../api/api'
import { Link, useNavigate } from 'react-router-dom'
import  FormError  from "../forms/FormError"
import FormSuccess from '../forms/FormSuccess'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {provider} from "../firebase";

function Signup() {
  const [form,setForm]= useState({});
  const [data,setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [errorMessage, setError] = useState({})
  const [successMessage, setSuccess] = useState(null)
  const navigate = useNavigate()
  
  useEffect(() => {
    if (data?.status === 201) {
      console.log("here")
      console.log(data)
      setForm({});
      setSuccess({"responsestatusText":"Signup is successful","detail":`${data.data.message}. Check your email for verification`})
      setTimeout(()=>{
      setData({})
      },2000)
    }else if(data?.status === 200){
      setSuccess({"responsestatusText":"Signup is successful","detail":` Email is verified`})
      setTimeout(()=>{
      
      navigate("/home",{state:{"user":data.data},replace:true})
      setData({})
      },2000)
    }
    
    
}, [data,navigate])

  function handleRegister(e) {
    e.preventDefault()
    delete form.confirmpassword
    setLoading(true)
    RegisterUser(form,setData,setError);
    setLoading(false)
    
  }

  function handleSocialRegister(){

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
        RegisterUserSocial(user,setData,setError);
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
                    {successMessage?FormSuccess(successMessage):""}
                    <Form.Group widths='equal'>
                        <Form.Input type="Email" name='email' label="Email" autofocus required placeholder='Enter your email' value={form.email||""} onChange={onchange}/>
                        <Form.Input type="text" name='username' label='Username' required  placeholder='Enter your username' value={form.username||""} onChange={onchange}/>
                      </Form.Group> 
                      <Form.Group widths='equal'>
                        <Form.Input type='Password' name='password' label='Password'required placeholder='Enter your password' value={form.password||""} onChange={onchange}/>
                        <Form.Input type='Password' name='confirmpassword' label='Confirm password' required placeholder='Confirm your password' value={form.confirmpassword||""} onChange={onchange}/>
                        </Form.Group>
                    <Button disabled={registerFormInvalid} loading={loading} fluid primary type='submit'>Register</Button>
                    <Header as="h4">Have an account? <Link to="/signin">Sign In</Link></Header>
                </Form>
                <Divider horizontal>or</Divider>
                <Button  color="teal" onClick={handleSocialRegister}><Icon name="google"/>Sign up with google</Button>
                <br/>  
        </div>
  )
}

export default Signup