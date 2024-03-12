import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [passworVerification, setPassworVerification] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityQuestionAnswer, setSecurityQuestionAnswer] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  
  //Makes sure the whole form is correct, and registers a new admin for the siteץ
  const addAdmin = () => {
    if(!name){
      setError('*Name is required');
      return;
    }
    
    if(!lastName){
      setError('*Last name is required');
      return;
    }
    
    if(!mail){
      setError('*Mail is required');
      return;
    }

    if(!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(mail)){
      setError('*Mail is not valid');
      return;
    }
    
    if(!password){
      setError('*Password is required');
      return;
    }
    
    if (!/(?=.*[A-Z])(?=.*[a-z]).{8,}/.test(password)) {
      setError('*Password must contain at least one uppercase letter, one lowercase letter, and be at least 8 characters long');
      return;
    }    
    
    if(passworVerification !== password){
      setError('*Passwords do not match, please verify your password');
      return;
    }
    
    if(securityQuestion === ''){
      setError('*Security question is required');
      return;
    }
    
    if(!securityQuestionAnswer){
      setError('*Security question answer is required');
      return;
    }

    setError('');

    axios.post('http://localhost:8080/api/register', {
      name,
      lastName,
      mail,
      password,
      securityQuestion,
      securityQuestionAnswer
    }).then((response) => {
      console.log(response.data);
      
      localStorage.setItem('registerMail', mail);

      navigate('/');
    }).catch((error) => {
        console.error('Error:', error);
        setError('*mail exist');
    });

    return;
  }
  
  return (
    <div className="registerContainer">
      <h1 className='slogan' ><span>S</span>.<span>H Mus</span>i<span>c</span><br></br> A Symphony for Every Mood, Every Moment.</h1>
      <div className="registerForm">
        <h1>Register for S.H Music system</h1>
        <form>
          <input className="inputField" type="text" placeholder="Name" onChange={(event) => setName(event.target.value)} />
          <input className="inputField" type="text" placeholder="Last Name" onChange={(event) => setLastName(event.target.value)} />
          <input className="inputField" type="email" placeholder="Email" onChange={(event) => setMail(event.target.value)} />
          <input className="inputField" type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
          <input className="inputField" type="password" placeholder="Verification Password" onChange={(event) => setPassworVerification(event.target.value)} />
          <select className="inputField" onChange={(event) => setSecurityQuestion(event.target.value)}>
            <option value="">Select...</option>
            <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
            <option value="In which city were you born?">In which city were you born?</option>
            <option value="What is your favorite movie?">What is your favorite movie?</option>
            <option value="Who is your favorite teacher?">Who is your favorite teacher?</option>
            <option value="What is the name of your first pet?">What is the name of your first pet?</option>
          </select>
          <input className="inputField" type="text" placeholder="Security Question Answer" onChange={(event) => setSecurityQuestionAnswer(event.target.value)} />
          <span className='error'>{error}</span>
          <br></br>
          <button className="registerBTN" type="button" onClick={() => addAdmin()}>
            Register
          </button>
        </form>
        
      </div>
      <div className="loginLinkDiv">
        Already have an account? <Link className='loginLink' to="/">Login</Link>
      </div>
    </div>
  );
}

export default Register;
