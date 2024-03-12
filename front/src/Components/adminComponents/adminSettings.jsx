import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAdminData } from '../../features/adminSlice';

function AdminSettings() {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mail, setMail] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityQuestionAnswer, setSecurityQuestionAnswer] = useState('');
    const [password, setPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [nameEdit, setNameEdit] = useState(false)
    const [lastNameEdit, setLastNameEdit] = useState(false)
    const [mailEdit, setMailEdit] = useState(false)
    const [passwordEdit, setPasswordEdit] = useState(false)
    const [securityQuestionEdit, setSecurityQuestionEdit] = useState(false)
    const [securityQuestionAnswerEdit, setSecurityQuestionAnswerEdit] = useState(false)
    const [scurityQuestionChecked, setSecurityQuestionAnswerChecked] = useState(false)
    const [securityQuestionAnswerINP, setSecurityQuestionAnswerINP] = useState(false)
    const [error, setError] = useState('');
    
    const adminData = useSelector((myStore) => myStore.adminSlice.admin);
    const [adminInfo, setAdminInfo] = useState(adminData);    

    const dispatch = useDispatch();

    // Toggle edit state for each input field, and opens or closes the input field.
    const editToggle = (event) => {
        const id = event.target.id;
        console.log(id);
    
        switch (id) {
            case 'nameINP':
                setNameEdit(!nameEdit);
                break;
            case 'lastNameINP':
                setLastNameEdit(!lastNameEdit);
                break;
            case 'mailINP':
                setMailEdit(!mailEdit);
                break;
            case 'securityQuestionINP':
                setSecurityQuestionEdit(!securityQuestionEdit);
                break;
            case 'securityQuestionAnswerINP':
                setSecurityQuestionAnswerEdit(!securityQuestionAnswerEdit);
                break;
            case 'passwordINP':
                setPasswordEdit(!passwordEdit);
                break;
            default:
                break;
        }
    };
    
    // Get the id of the clicked element to determine which input field is being saved.
    //The kind of data being saved based on the clicked element's id.
    // Validate the inputs fields and then send a POST request to the server to save the updated data.
    const save = (event) => {
        const id = event.target.id;
        console.log(id);
        let kind;
        
        switch (id) {
            case 'nameSave':
                setNameEdit(!nameEdit);
                kind = 'name'
                console.log(kind);
                break;
            case 'lastNameSave':
                setLastNameEdit(!lastNameEdit);
                kind = 'lastName'
                console.log(kind);
                break;
            case 'mailSave':
                if(/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(mail)){
                    setMailEdit(!mailEdit);
                    kind = 'mail'
                    localStorage.setItem('adminMail', mail);
                    console.log(kind);
                }else{
                    setError('*Mail is not valid');
                    return;
                }
                
                break;
            case 'securityQuestionSave':
                setSecurityQuestionEdit(!securityQuestionEdit);
                kind = 'securityQuestion'
                console.log(kind);
                break;
            case 'securityQuestionAnswerSave':
                setSecurityQuestionAnswerEdit(!securityQuestionAnswerEdit);
                kind = 'securityQuestionAnswer'
                console.log(kind);
                break;
            case 'passwordSave':
                if(/(?=.*[A-Z])(?=.*[a-z]).{8,}/.test(password)){
                    if(password === currentPassword){
                        setError(`*New password and current password can't be the same`);            
                        return;
                    }
                    setPasswordEdit(!passwordEdit);
                    kind = 'password'
                    console.log(kind);
                }else{
                    setError('*Password must contain at least one uppercase letter, one lowercase letter, and be at least 8 characters long');
                    return;
                }
                
                break;
            default:
                break;
        }

        axios.post('http://localhost:8080/api/editSettings', {
            kind,
            identificationMail: adminInfo.mail,
            name,
            lastName,
            mail,
            securityQuestion,
            securityQuestionAnswer,
            password,
            currentPassword
        }).then((response) => {
            // Update the local state with the response from the server
            setName(response.data.name);
            setLastName(response.data.lastName);
            setMail(response.data.mail);
            setSecurityQuestion(response.data.securityQuestion);
            setSecurityQuestionAnswer(response.data.securityQuestionAnswer);
            setPassword(response.data.password);
            setError('');
            setAdminInfo(response.data);
            dispatch(setAdminData(response.data))
        }).catch((error) => {
            setError('*Current password worng');
            console.error('Error:', error.message);
        })
    };
    
    //Checks the security question answer.
    const securityQuestionAnswerCheck = () => {
        if(adminInfo.securityQuestionAnswer === securityQuestionAnswerINP){
            setError('');
            setSecurityQuestionAnswerChecked(true); 
        }else{
            setError('Wrong Answer');
        }
        
    }

    useEffect(() => {
        setTimeout(() =>{
            setError('');
        }, 10000)
    }, [adminInfo]); 

    return (
        <div className="adminSettingsContainer">
            { !scurityQuestionChecked ? 
                <>
                    <div className='securityQuestionAnswerPass'>
                        <h3>Security Question</h3>
                        <h1>{adminInfo.securityQuestion}</h1>
                        <h2>Answer:</h2>
                        <input type='password' onChange={(event) => setSecurityQuestionAnswerINP(event.target.value)}></input>
                        <br></br>
                        <span className='error'>{error}</span>
                        <br></br>
                        <button onClick={() => securityQuestionAnswerCheck()}>confirm</button>
                    </div>
                </> : ""
            }
            { scurityQuestionChecked ?  
            <>
            <div className='adminSettingsTitle'>
                <h1>My settings</h1>
                <span className='error'>{error}</span>
            </div>
            
            <div className="adminInfoItem" id="nameINP" onClick={(event) => editToggle(event)}>
                <span className="infoLabel">Name:</span> 
                {nameEdit ? 
                    <input onChange={(event) => setName(event.target.value)}></input> : adminInfo.name
                }
                <br></br>
                {nameEdit ? <button id="nameSave" onClick={(event) => save(event)}>Save name</button> : ''}
            </div>
            

            <div className="adminInfoItem" id="lastNameINP" onClick={(event) => editToggle(event)}>
                <span className="infoLabel">Last Name:</span>
                {lastNameEdit ? 
                    <input onChange={(event) => setLastName(event.target.value)}></input> : adminInfo.lastName
                }
                <br></br>
                {lastNameEdit ? <button id='lastNameSave' onClick={(event) => save(event)}>Save last name</button> : ''}
            </div>
           
            <div className="adminInfoItem" id="mailINP" onClick={(event) => editToggle(event)}>
                <span className="infoLabel">Mail:</span>
                {mailEdit ? 
                    <input onChange={(event) => setMail(event.target.value)}></input> : adminInfo.mail 
                }
                <br></br>
                {mailEdit ? <button id='mailSave' onClick={(event) => save(event)}>Save mail</button> : ''}
            </div>

            <div className="adminInfoItem" id="securityQuestionINP" onClick={(event) => editToggle(event)}>
                <span className="infoLabel">Security Question:</span> 
                {securityQuestionEdit ? 
                    <select className="inputField"onChange={(event) => setSecurityQuestion(event.target.value)}>
                        <option value="">Select...</option>
                        <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                        <option value="In which city were you born?">In which city were you born?</option>
                        <option value="What is your favorite movie?">What is your favorite movie?</option>
                        <option value="Who is your favorite teacher?">Who is your favorite teacher?</option>
                        <option value="What is the name of your first pet?">What is the name of your first pet?</option>
                    </select>
                : 
                    adminInfo.securityQuestion
                }
                <br></br>
                {securityQuestionEdit ? <button id='securityQuestionSave' onClick={(event) => save(event)}>Save security question</button> : ''}
            </div>
            
            <div className="adminInfoItem" id="securityQuestionAnswerINP" onClick={(event) => editToggle(event)}>
                <span className="infoLabel">Security Question Answer:</span> 
                {securityQuestionAnswerEdit ? 
                    <input onChange={(event) => setSecurityQuestionAnswer(event.target.value)}></input> : `${'*'.repeat(adminInfo.securityQuestionAnswer.length)}`
                }
                <br></br>
                {securityQuestionAnswerEdit ? <button id='securityQuestionAnswerSave' onClick={(event) => save(event)}>Save security question answer</button> : ''}
            </div>
            
            <div className="adminInfoItem"  id="passwordINP" onClick={(event) => editToggle(event)}>
                <span className="infoLabel">Change Password</span> 
                {passwordEdit ? 
                    <span>
                        <br></br>
                        Current password:<input onChange={(event) => setCurrentPassword(event.target.value)} type='password'></input>
                        <br></br>
                        New Password:<input onChange={(event) => setPassword(event.target.value)} type='password'></input>
                    </span>
                     : ''
                }
                <br></br>
                {passwordEdit ? <button id='passwordSave' onClick={(event) => save(event)}>Save passord</button> : ''}
            </div>
            <br></br>
            <span>
                *click on the field to edit.
            </span>
            </> : ''}
        </div>
    );
}

export default AdminSettings;
