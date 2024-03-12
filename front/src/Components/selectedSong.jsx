import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TopLiked from './topLiked';
import 'alertifyjs/build/css/alertify.css';
import 'alertifyjs/build/css/themes/default.css';
import alertify from 'alertifyjs';

function SelectedSong() {
  const songReducer = useSelector((myStore) => myStore.songSlice.songName);
  const idReducer = useSelector((myStore) => myStore.songSlice.id);
  const [fullName, setFullName] = useState('');
  const [hideContainer, setHideContainer] = useState(false);
  const [error, setError] = useState('');

  const eventId = localStorage.getItem('eventId');

  const navigate = useNavigate();

  //Verifies that a token exists, and allows access.
  const activeToken = async () => {
    axios.get('http://localhost:8080/api/token', {
        headers: {
            Authorization: localStorage.getItem('token')
        }
    })
    .then().catch((error) => {
        navigate('/');
    });
  }

  //Save the selected song to the current event.
  const saveSong = (event) => {
    event.preventDefault();
    
    if(!fullName){
      setError('Must to write your name');
      return;
    }

    axios.post('http://localhost:8080/api/sendSong', {
      eventId: eventId,
      title: songReducer,
      videoId: idReducer,
      fullName: fullName,
    })
    .then((response) => {
      console.log('Response:', response.data);
      alertify.success('Song saved');
      setError('');
      setHideContainer(true);
    })
    .catch((error) => {
      console.error('Error:', error);
      return;
    });

    setTimeout(()=>{
      navigate('/home');
    }, 3000);
  };

  useEffect(() => {
    activeToken();
  },[]);

  return (
    <div className='selectedSongContainer'>
      <svg className='wave' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#3498db" fillOpacity="1" d="M0,256L60,229.3C120,203,240,149,360,154.7C480,160,600,224,720,213.3C840,203,960,117,1080,85.3C1200,53,1320,75,1380,85.3L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
      </svg>
      {hideContainer ? <p>Thank you</p> : ''}
      <div className={`selectedSong ${hideContainer ? 'hidden' : ''}`}>
        <button className="backBTN" onClick={() => window.history.back()}>Back to search</button>
        <h1>{songReducer}</h1>
        {songReducer && (
          <iframe
            title="YouTube Video"
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${idReducer}`}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        )}
        <form onSubmit={saveSong}>
          <h3>Enter your full name:</h3>
          <input type="text" onChange={(event) => setFullName(event.target.value)} />
          <button type="submit">Add to playlist</button>
          <br></br>
          <div className='error'>
            {error}
          </div>
        </form>
      </div>
      <svg className='blackWave' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill="#" fill-opacity="1" d="M0,256L60,229.3C120,203,240,149,360,154.7C480,160,600,224,720,213.3C840,203,960,117,1080,85.3C1200,53,1320,75,1380,85.3L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
            </svg>
      <TopLiked/>
    </div>
    
  );
}

export default SelectedSong;
