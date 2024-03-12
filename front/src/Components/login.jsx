import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const registerMail = localStorage.getItem('registerMail');

  const [mail, setMail] = useState(registerMail || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  //Makes sure the mail and password are correct.
  //If mail and password are correct, creates a token and navigate to the admin's home page. 
  const login = (event) => {
      console.log(event)
    if(mail === '' || password === ''){
      setError('*All fields required');
      return;
    }
    console.log(mail);
    console.log(password);

    axios.post('http://localhost:8080/api/login', {
      mail,
      password
    })
    .then((response) => {
      const token = response.data.token;
      setError('');
      localStorage.setItem('adminMail', mail);
      localStorage.setItem('token', token);
      navigate('/admin');
    })
    .catch((error) => {
        setError('Invalid email or password');
        console.error('Error fetching data:', error);
    });
  }

  return (
    <div className="loginContainer">
        <h1 className='slogan' ><span>S</span>.<span>H Mus</span>i<span>c</span><br></br> A Symphony for Every Mood, Every Moment.</h1>
      <div className="loginForm">
        <h1>Login to S.H Music system</h1>
        <form>
          <input className="inputField" placeholder="Email" onChange={(event) => {localStorage.removeItem('registerMail'); setMail(event.target.value)}} value={mail}/>
          <input className="inputField" type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)}/>
          <span className='error'>{error}</span>
          <br></br>
          <button className="loginBTN" type='button' onClick={(event) => login(event)} >
            Login
          </button>
        </form>
      </div>
      <div className="registerLinkDiv">
          Don't have an account? <Link className='registerLink' to="/register">Register</Link>
      </div>
    </div>
  );
}

export default Login;
