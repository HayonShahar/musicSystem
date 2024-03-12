import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setEventsArray } from '../../features/songSlice';
import Swal from "sweetalert2";

function AdminEditEvent({addEventSidebar}) {
    const [allEvents, setAllEvents] = useState([]);
    const [editEventFrom, setEditEventForm] = useState(false);
    const [eventId, setEventId] = useState('');
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
    const [edited, setEdited] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [rotateOut, setRotateOut] = useState(true);

    const adminInfo = useSelector((myStore) => myStore.adminSlice.admin);

    const dispatch = useDispatch();

    //Get all the events and filter them to the current admin.
    const events = () => {
        axios.get('http://localhost:8080/api/events')
        .then((response) => {
            const adminsEvents = response.data.filter(event => event.eventAdminId === adminInfo._id);

            const sortedEvents = adminsEvents.sort((a, b) => {
                return new Date(a.date) - new Date(b.date);
            });

            setAllEvents(sortedEvents);
            dispatch(setEventsArray(sortedEvents));
            console.log(allEvents);
        })
        .catch((err) => {
            console.log(`Error at get events: ${err}`);
        })
    }

    //Get the id of the evnet and sending delete request to the server.
    const deleteEvent = (event) => {
        const id = event.target.id;

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete('http://localhost:8080/api/deleteEvent',{
                    params: {
                        id: id
                    }
                })
                .then((response) => {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                    console.log(response);
                })
                .catch((err) => {
                    console.log(`Error at delete event: ${err}`);
                });
            }
        });
    }

    //Function to submit the edit of the event.
    //Validation check for the input fields, and sending a post request to edit the current event by id.
    const submitEditEvent = (event) => {
        const id = event.target;
        console.log(id)
        if(!eventType || eventType === 'Other' || eventType === '-'){
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

        if(!musicPreferences || musicPreferences === 'Other' || musicPreferences === '-'){
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

        axios.post('http://localhost:8080/api/editEvent', {
            id: eventId,
            eventType: typeOfEvent,
            ownerName,
            mail,
            phone,
            date,
            musicPreferences: typeOfMusic,
            requests
        }).then((response) => {
            console.log(response.data);
            setEditEventForm(false);
            setEventType('');
            setOwnerName('');
            setMail('');
            setPhone('');
            setDate('');
            setMusicPreferences('');
            setOtherMusicPreference('');
            setRequests('');
            setError('');
            setEdited(true);
            setSuccessMessage('Event edited!');
            setTimeout(() => {
                setEdited(false);
            }, 5000);
            setEdited(true);

            setRotateOut(false);
            setTimeout(() => {
                setEdited(true);
            }, 800);
        
            setTimeout(() => {
                setRotateOut(true);
                setEdited(false);
            }, 3000);
        }).catch((error) => {
            console.error('Error:', error.message);
        });

        return;
    }

    //Function to initiate the editing of an event.
    //Gets the details of that event and places them in the editing form.
    const editEvent = (event) => {
        const id = event.target.id;
        const currentEvent = allEvents.filter(event => event._id === id);

        setEventType(currentEvent[0].eventType);
        setOwnerName(currentEvent[0].ownerName);
        setMail(currentEvent[0].mail);
        setPhone(currentEvent[0].phone);
        setDate(currentEvent[0].date);
        setMusicPreferences(currentEvent[0].musicPreferences);
        setRequests(currentEvent[0].requests);
        setEditEventForm(!editEventFrom);
        setEventId(id);
    }
    
    //Cancel the edit form.
    const cancelEdit = () => {
        setEditEventForm(!editEventFrom);
    }

    //Get the current date.
    const splitDate = (date) => {
        const splitedDate = date.split('-');
        return(`${splitedDate[2]}/${splitedDate[1]}/${splitedDate[0]}`)
    }
    
    useEffect(() => {
        events();
    },[allEvents])
    
    return ( 
        <div className="editEventContainer">
            <div>
                {allEvents.length > 0 ? '' :
                    <p className="noEvents">No events available, want to add new event? <a className="link" onClick={() => addEventSidebar('closeSidebar')}>Add new event</a></p>
                }
            </div>

            {edited ? 
            (  
                <div className="editEventMassage">
                <div className={`${rotateOut ? '' : 'rotateIn'}`}>
                    <h1 className="newEventSeved">{successMessage}</h1>
                </div> 
                </div>
            )
            :
            (
                <div className={`${rotateOut ? 'rotateIn' : 'rotateOut'}`}>
                    <div className={`eventsDivEdit ${editEventFrom ? 'hide' : 'show'}`}>
                        {allEvents.map((events) => (
                            <div className={`event ${events.isDeleting ? 'closingAnimation' : ''}`}
                            key={events._id}>
                            <button id={events._id} className="deleteEvent" onClick={(event) => deleteEvent(event)}>Delete</button>
                            <button id={events._id} className="editEventBTN" onClick={(event) => editEvent(event)}>Edit</button>
                            <div className="eventData">
                                <span className="owner">{events.ownerName}</span>
                                <span className="date">{splitDate(events.date)}</span>
                                <span className="eventType">{events.eventType}</span>
                                <span className="musicPreferences">{events.musicPreferences}</span>
                                <span className="phone">{events.phone}</span>
                            </div>
                            </div>
                        ))}
                    </div>
                    <div className={`editForm ${editEventFrom ? 'show' : 'hide'}`}>
                        <div className="editEventDiv">
                            <form>
                                <h1>Edit Event</h1>
                                <div>
                                    Event Type:
                                    <select onChange={(event) => setEventType(event.target.value)} value={eventType}>
                                        <option>{eventType}</option>
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
                                        <option>{musicPreferences}</option>
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
                                <div className="success-message">
                                    {successMessage}
                                </div>
                                <button type="button" onClick={(event) => submitEditEvent(event)}>Edit</button>
                            </form>
                            <div className="cancelEditForm">
                                <button onClick={() => cancelEdit()}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminEditEvent;