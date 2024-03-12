import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setEventsArray } from '../../features/songSlice';
import Swal from "sweetalert2";

function AdminHome({addEventSidebar}) {
    const [allEvents, setAllEvents] = useState([]);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const adminInfo = useSelector((myStore) => myStore.adminSlice.admin);
    const adminName = adminInfo ? adminInfo.name : 'Unknown';

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
        })
        .catch((err) => {
            console.log(`Error at get events: ${err}`);
        })
    }

    //Checks if the password is correct.
    //If the password is correct, navigate to home page.
    //If the password isn't correct, stay in the Admin home.
    const homePage = (id) => {
        Swal.fire({
            title: "Enter password:",
            html: `<input type="password" id='password'/><br>
            <span id="error"></span>`,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {
                const inputPassword = document.getElementById('password').value;

                axios.post('http://localhost:8080/api/hashPassword',{
                    mail: localStorage.getItem('adminMail'),
                    password: inputPassword
                })
                .then((response) => {
                    Swal.fire({
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 2000 
                    });

                    localStorage.setItem('eventId', id);
                    navigate('/home');
                })
                .catch((err) => {
                    Swal.fire({
                        icon: 'error',
                        text: 'Wrong password!',
                        confirmButtonColor: 'red'
                    });
                    console.log(`Error at get events: ${err}`);
                    return;
                });
            }
        });
    }

    //Get the current date.
    const splitDate = (date) => {
        const splitedDate = date.split('-');
        return(`${splitedDate[2]}/${splitedDate[1]}/${splitedDate[0]}`)
    }
    
    useEffect(() => {
        events();
    }, [adminInfo]);
    
    return (
        <div>
            <h1>Hello, {adminName}</h1>
            <div>
                <div className="eventsDiv">
                    {allEvents.length > 0 ? (
                        allEvents.map((event) => (
                            <div className={`event ${event.isDeleting ? 'closingAnimation' : ''}`} key={event._id}>
                                <div className="eventData" onClick={() => homePage(event._id)}>
                                    <span className="owner">{event.ownerName}</span>
                                    <span className="date">{splitDate(event.date)}</span>
                                    <span className="eventType">{event.eventType}</span>
                                    <span className="musicPreferences">{event.musicPreferences}</span>
                                    <span className="phone">{event.phone}</span>
                                </div>
                            </div>
                        ))
                    ) : ''}
                </div>
                <div>
                    {allEvents.length > 0 ? '' :
                        <p className="noEvents">No events available, want to add new event? <a className="link" onClick={() => addEventSidebar('closeSidebar')}>Add new event</a></p>
                    }
                </div>
            </div>
        </div>
    );
}

export default AdminHome;