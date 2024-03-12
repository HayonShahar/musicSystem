import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopLiked from './topLiked';
import {useDispatch, useSelector} from 'react-redux';
import { setSongName, setId } from '../features/songSlice';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import 'alertifyjs/build/css/themes/default.css';
import Swal from 'sweetalert2';

function Home() {
    const [song, setSong] = useState('');
    const [videos, setVideos] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);

    const eventId = localStorage.getItem('eventId');

    const songsArray = useSelector((myStore) => myStore.songSlice.songsArray);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    //Verifies that a token exists, and allows access.
    const activeToken = async () => {
        axios.get('http://localhost:8080/api/token', {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
        .then((response) => {
            
        })
        .catch((error) => {
            navigate('/');
        });
    }

    //Check the password to return to the admin home page.
    const adminSettings = () => {
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

                    localStorage.removeItem('eventId');

                    navigate('/admin');
                })
                .catch((err) => {
                    Swal.fire({
                        icon: 'error',
                        text: 'Wrong password!',
                        confirmButtonColor: 'red'
                    });
                    return;
                });
            }
        });
    }

    //Searches for the song and gives 5 options to choose from.
    const songSearch = (event) => {
        event.preventDefault();
        
        axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                maxResults: 5,
                q: song,
                type: 'video',
                key: 'AIzaSyD4p2VdBZCITs2Qz4v4BOjRx0uQsdVXaOI',
            },
        })
        .then((response) => {
            console.log(response.data)
            setVideos(response.data.items);
            setSearchPerformed(true);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
    };

    //Checks if the song is already in the list of selected songs for that event.
    //If not, sends his details to 'selectedSong' and navigates to '/selected'.
    const videoSelect = (video) => {
        let videoId = songsArray.filter(song => song.songId === video.id.videoId);
        if (videoId.length >= 1) {
            alertify.error('This song is already selected');
            videoId = [];
            return;
        }
        
        console.log(video)
        dispatch(setSongName(video.snippet.title));
        dispatch(setId(video.id.videoId));

        navigate('/selected');
    };

    useEffect(() => {
        activeToken();
        if (!eventId) {
            navigate('/');
        }
    });

    return (
        <div>
            <div className={`waveDiv ${searchPerformed ? 'searchPerformed' : ''}`}>
            <button className='adminBTN' onClick={()=> adminSettings()}>Admin Settings</button>
                <div className={`youtubeSearch ${searchPerformed ? 'searchPerformed' : ''}`}>
                    <h1>Which song would you like to hear at this event?</h1>
                    <form onSubmit={songSearch}>
                        <input type="text" value={song} onChange={(event) => setSong(event.target.value)} />
                        <button type="submit">Search</button>
                    </form>
                </div>
            </div>
            <svg className='blueWave' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill="#3498db" fillOpacity="1" d="M0,256L60,229.3C120,203,240,149,360,154.7C480,160,600,224,720,213.3C840,203,960,117,1080,85.3C1200,53,1320,75,1380,85.3L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
            </svg>
            <div className={`homeContainer ${searchPerformed ? 'searchPerformed' : ''}`}>
                <div className='search'>
                    <div className='youtubeResults'>
                        {videos.map((video) => (
                            <div>
                                <div className='youTubeVideo'>
                                    <div>
                                        <p>{video.snippet.title}</p>
                                        <iframe key={video.id.videoId}
                                            title="YouTube Video"
                                            width="560"
                                            height="315"
                                            src={`https://www.youtube.com/embed/${video.id.videoId}`}
                                            frameBorder="0"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                    <button onClick={() => videoSelect(video)}>select</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <svg className='blackWave' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill="#" fillOpacity="1" d="M0,256L60,229.3C120,203,240,149,360,154.7C480,160,600,224,720,213.3C840,203,960,117,1080,85.3C1200,53,1320,75,1380,85.3L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
            </svg>
            <TopLiked />
        </div>
    );
}

export default Home;
