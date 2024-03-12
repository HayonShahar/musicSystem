import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAdminData } from '../features/adminSlice';
import AdminHome from './adminComponents/adminHome';
import AdminAddEvent from './adminComponents/adminAddEvent';
import AdminSongs from './adminComponents/adminSongs';
import AdminEditEvent from './adminComponents/adminEditEvent';
import AdminSettings from './adminComponents/adminSettings';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

function Admin() {
    const [sidebarWidth, setSidebarWidth] = useState(0);
    const [contentMargin, setContentMargin] = useState(0);
    const [icon, setIcon] = useState(false);
    const [home, setHome] = useState(true);
    const [addEvent, setAddEvent] = useState(false);
    const [songs, setSongs] = useState(false);
    const [editEvent, setEditEvent] = useState(false);
    const [settings, setSettings] = useState(false);
    const [adminInfo, setAdminInfo] = useState(null);
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Function to fetch admin data from the server
    const adminData = async () => {
        axios.get('http://localhost:8080/api/admin', {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
        .then((response) => {
            const adminsArray = response.data;
            const adminFatchingMail = localStorage.getItem('adminMail');
            const admin = adminsArray.filter(admin => admin.mail === adminFatchingMail)[0];
            setAdminInfo(admin);
            dispatch(setAdminData(admin));
        })
        .catch((error) => {
            navigate('/');
            console.error('Error fetching data:', error);
        });
    }

    // Function to toggle the sidebar
    const toggleSidebar = () => {
        if (sidebarWidth === 250) {
        setSidebarWidth(0);
        setContentMargin(0);
        setIcon(false);
        } else {
        setSidebarWidth(250);
        setContentMargin(250);
        setIcon(true);
        }
    };

    // Functions to set active state for different components in the sidebar, and sets who is showen
    const homeSidebar = () => {
        toggleSidebar(); 
        setHome(true);
        setAddEvent(false);
        setEditEvent(false);
        setSongs(false);
        setSettings(false);
    }

    const addEventSidebar = (toToggle) => {
        if(toToggle !== 'closeSidebar'){
            toggleSidebar();
        }
        setAddEvent(true);
        setHome(false);
        setEditEvent(false);
        setSongs(false);
        setSettings(false);
    }
    
    const songsSidebar = () => {
        toggleSidebar();
        setSongs(true);
        setAddEvent(false);
        setHome(false);
        setEditEvent(false);
        setSettings(false);
    }
    
    const editEventSidebar = () => {
        toggleSidebar();
        setEditEvent(true);
        setAddEvent(false);
        setHome(false);
        setSongs(false);
        setSettings(false);
    }

    const settingsSidebar = () => {
        toggleSidebar();
        setSettings(true);
        setAddEvent(false);
        setEditEvent(false);
        setSongs(false);
        setHome(false);
    }
    
    //Logout function
    const logoutSidebar = () => {
        Swal.fire({
            title: "Logout?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Logout"
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/');
                localStorage.removeItem('adminMail');
                localStorage.removeItem('token');
            }
          });
    }

    // Function to get and update the current time
    const startTime = () => {
        const checkTime = (i) => {
            if (i < 10) {i = "0" + i}; 
            return i;
        }
        
        const currentTime = new Date();
        let h = currentTime.getHours();
        let m = currentTime.getMinutes();
        let s = currentTime.getSeconds();
        m = checkTime(m);
        s = checkTime(s);
        
        const currentDay = new Date();
        const year = currentDay.getFullYear();
        let month = currentDay.getMonth() + 1; // Month is zero-based
        let day = currentDay.getDate();

        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        const formattedDate = `${day}/${month}/${year}`;

        setTimeout(startTime, 1000);
    
        setDate(formattedDate);
        setTime(h + ":" + m + ":" + s);
    }

    useEffect(() => {
        adminData();
        startTime();
    }, [adminInfo]); 
    
    return ( 
        <div>
            <svg className='adminWave' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill="#3498db" fillOpacity="1" d="M0,256L60,229.3C120,203,240,149,360,154.7C480,160,600,224,720,213.3C840,203,960,117,1080,85.3C1200,53,1320,75,1380,85.3L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
            </svg>
            <div className='clock'><span>{time}</span><br></br><span id="date">{date}</span></div>
            <button className="openBTN" onClick={toggleSidebar}>
                {icon ? 'x' : '☰'}
            </button>

            <div className="sidebar" style={{ width: `${sidebarWidth}px` }}>
                <div className='topSidebar'>
                    <button onClick={() => homeSidebar()}>Events</button>
                    <button onClick={() => addEventSidebar()}>Add Event</button>
                    <button onClick={() => songsSidebar()}>Songs</button>
                    <button onClick={() => editEventSidebar()}>Edit event</button>
                    <button onClick={() => settingsSidebar()}>Settings</button>
                </div>
                <div className='bottomSidebar'>
                    <button onClick={() => logoutSidebar()}>logout</button>
                </div>
            </div>

            <div className="content" style={{ marginLeft: `${contentMargin}px` }}>
                {home ? <AdminHome addEventSidebar={addEventSidebar}/> : ''}
                {addEvent ? <AdminAddEvent /> : ''}
                {songs ? <AdminSongs addEventSidebar={addEventSidebar} /> : ''}
                {editEvent ? <AdminEditEvent addEventSidebar={addEventSidebar} /> : ''}
                {settings ? <AdminSettings adminData={adminData}/> : ''}
            </div>
        </div>
     );
}

export default Admin