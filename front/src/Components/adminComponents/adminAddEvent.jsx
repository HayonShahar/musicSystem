import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

function AdminAddEvent() {
    const [eventType, setEventType] = useState('');
    const [otherEventType, setOtherEventType] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [mail, setMail] = useState('');
    const [phone, setPhone] = useState('');
    const [date, setDate] = useState('');
    const [musicPreferences, setMusicPreferences] = useState('');
    const [otherMusicPreference, setOtherMusicPreference] = useState('');
    const [requests, setRequests] = useState('');
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(true);
    const [rotateOut, setRotateOut] = useState(true);

    const adminInfo = useSelector((myStore) => myStore.adminSlice.admin);

    //Function to submit a new event, Validation checks for input fields and sending a post request to create a new event.
    const submitNewEvent = (event) => {
        console.log(event)
        if(!eventType || eventType === 'Other'){
            if(!otherEventType){
                setError('Must to choose event type');
                return;  
            }
        }

        if(!ownerName){
            setError('Must to write event owner name');
            return;
        }

        if(!mail || !/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(mail)){
            setError('Invalid mail');
            return;
        }

        if(!phone || !/^\d{10}$/.test(phone)){
            setError('Must to be 10 numbers');
            return;
        }


        if(!date){
            setError('Must to choose a date');
            return;
        }
        
        if(new Date(date) <= new Date()){
            console.log(new Date())
            console.log(new Date(date))
            setError("Date can't be before the current date");
            return;
        }

        if(!musicPreferences || musicPreferences === 'Other'){
            if(!otherMusicPreference){
                setError('Must to choose or write music preferencs');
                return;
            }
        }

        setError('');
        
        let typeOfEvent = '';
        let typeOfMusic = '';

        if (eventType === 'Other') {
            typeOfEvent = otherEventType;
        } else {
            typeOfEvent = eventType;
        }
    
        if (musicPreferences === 'Other') {
            typeOfMusic = otherMusicPreference;
        } else {
            typeOfMusic = musicPreferences;
        }

        axios.post('http://localhost:8080/api/addEvent', {
            adminId: adminInfo._id,
            eventType: typeOfEvent,
            ownerName,
            mail,
            phone,
            date,
            musicPreferences: typeOfMusic,
            requests
        }).then((response) => {
            console.log(response);
        
        }).catch((error) => {
            console.error('Error:', error.message);
        }).finally(() => {
            setEventType('');
            setOtherEventType('');
            setOwnerName('');
            setMail('');
            setPhone('');
            setDate('');
            setMusicPreferences('');
            setOtherMusicPreference('');
            setRequests('');
            setError('');
            setShowForm(false);
            setTimeout(() => {
                setShowForm(true);
            }, 5000);
        });
        setShowForm(false);
        setRotateOut(false);
        setTimeout(() => {
            setShowForm(false);
        }, 800);
    
        setTimeout(() => {
            setRotateOut(true);
            setShowForm(true);
        }, 3000);
        
        return;
    }

    return (
        <div className='addEventContainer'>
            { showForm ? 
            <form className={`${rotateOut ? 'rotateIn' : 'rotateOut'}`}>
                <h1>New Event</h1>
                <div>
                    Event Type:
                    <select onChange={(event) => setEventType(event.target.value)} value={eventType}>
                        <option>-</option>
                        <option>Wedding</option>
                        <option>Party</option>
                        <option>Company event</option>
                        <option>Other</option>
                    </select>
                    <br></br>
                    {eventType === 'Other' ?
                        <span>
                            Other Type: <input type='text' onChange={(event) => setOtherEventType(event.target.value)} value={otherEventType}/>
                        </span>
                        : ''
                    }
                </div>
                <div>
                    Event owner name: <input type='text' onChange={(event) => setOwnerName(event.target.value)} value={ownerName} />
                </div>
                <div>
                    Mail: <input type='text' onChange={(event) => setMail(event.target.value)} value={mail}/>
                </div>
                <div>
                    Phone: <input type='text' onChange={(event) => setPhone(event.target.value)} value={phone}/>
                </div>
                <div>
                    Date: <input type='date' onChange={(event) => setDate(event.target.value)} value={date}/>
                </div>
                <div>
                    <label htmlFor="musicPreferences">Music Preferences:</label>
                    <select id="musicPreferences" onChange={(event) => setMusicPreferences(event.target.value)} value={musicPreferences}>
                        <option>-</option>
                        <option >Pop</option>
                        <option >Rock</option>
                        <option >Hip Hop</option>
                        <option >Electronic</option>
                        <option >Jazz</option>
                        <option >Classical</option>
                        <option >Other</option>
                    </select>
                    {musicPreferences === 'Other' ?
                        <span>
                            <br></br>
                            Other Music Preference: <input type='text' onChange={(event) => setOtherMusicPreference(event.target.value)} value={otherMusicPreference}/>
                        </span>
                        : ''
                    }
                </div>
                <div>
                    Special Requests? <input type='text' onChange={(event) => setRequests(event.target.value)} value={requests}/>
                </div>
                <div className="error">
                    {error}
                </div>
                <button type="button" onClick={(event) => submitNewEvent(event)}>Save Event</button>
            </form>
            : 
            <>
                <div className={`${rotateOut ? '' : 'rotateIn'}`}>
                    <h1 className="newEventSeved">New Event Saved</h1>
                </div>
            </>
            }
        </div>
    );
}

export default AdminAddEvent;
