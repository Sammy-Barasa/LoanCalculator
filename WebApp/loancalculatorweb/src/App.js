
import './App.css';
import { Routes,Route,Link,NavLink } from 'react-router-dom';
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import LoansPage from './pages/LoansPage';
import ApiPage from './pages/ApiPage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p className="App-title">
          <NavLink to="/">Loan Calculator</NavLink>
        </p>
        <div>
          <div><Link to="/signin">Login</Link></div>
          <div><Link to="/signup">SignUp</Link></div>
          <div><Link to="/api">API</Link></div>
        </div>
      </header>
      <div className="main">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/signin" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/loans" element={<LoansPage/>}/>
          <Route path="/api" element={<ApiPage/>}/>
        </Routes>
      </div>
      {/* <footer>
        <p>@loancalulator</p>
      </footer> */}
    </div>
  );
}

export default App;
