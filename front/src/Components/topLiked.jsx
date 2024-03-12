import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import { setSongsArray } from '../features/songSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

function TopLiked() {
    const [songs, setSongs] = useState([]);

    const eventId = localStorage.getItem('eventId');

    const dispatch = useDispatch();

    //Updates the amount of likes per song.
    const like = async (songId) => {    

        await axios.post('http://localhost:8080/api/likes', {
            songId: songId
        })
        .then((response) => {
            const sortedSongs = response.data.sort((a, b) => {
                return b.likes - a.likes;
            });
            console.log(sortedSongs)
            setSongs(sortedSongs);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    //Constantly receiving up-to-date information about the likes.
    useEffect(() => {
        axios.get('http://localhost:8080/api/songs')
        .then((response) => {
            const sortedSongs = response.data.sort((a, b) => {
                return b.likes - a.likes;
            });
            console.log(response.data);
            const filteredSongs = sortedSongs.filter((song) => song.eventId === eventId);

            setSongs(filteredSongs);
            dispatch(setSongsArray(filteredSongs));
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
    }, [songs]);

    return ( 
        <div className="songList">
            <h1>Top Liked Songs<FontAwesomeIcon className='trophy' icon={faTrophy} /></h1>
            <div className='list'>
                <ul>
                    {songs.map((song, index) => (
                        <li className='songInList' key={song._id}>
                            <span className="index">{index+1}.</span>
                            <span className="songName">{song.name}</span>
                            <button className='likeBTN' onClick={()=>like(song._id)}><span>{song.likes}</span><FontAwesomeIcon icon={faThumbsUp} /></button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
     );
}

export default TopLiked;