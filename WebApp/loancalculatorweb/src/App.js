
import React,{useEffect, useState} from 'react'
import './App.css';
import { Routes,Route,Link,NavLink } from 'react-router-dom';
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import LoansPage from './pages/LoansPage';
import ApiPage from './pages/ApiPage';
import { useLocation } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import Admin from './pages/Admin';
import ResultPage from './pages/ResultPage';


function App() {
  const [setuser, setUser] = useState(null)
  const location = useLocation();
  // console.log(location, " useLocation Hook");
  useEffect(()=>{
    const user = location.state?.user;
    setUser(user)

  },[location.state?.user])
  

  return (
    <div className="App">
      <header className="App-header">
        <p className="App-title">
          <NavLink to="/">Loan Calculator</NavLink>
        </p>
        <div>
          {setuser?"":<div><Link to="/signin">Login</Link></div>}
          {setuser?"":<div><Link to="/signup">SignUp</Link></div>}
          <div><Link to="/api" state={{setuser:setuser}}>API</Link></div>
        </div>
      </header>
      <div className="main">
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/signin" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/loans" element={<LoansPage/>}/>
          <Route path="/api" element={<ApiPage/>}/>
          <Route path="/admin" element={<Admin/>}/>
          <Route path="/results" element={<ResultPage/>}/>
        </Routes>
      </div>
      {/* <footer>
        <p>@loancalulator</p>
      </footer> */}
    </div>
  );
}

export default App;
