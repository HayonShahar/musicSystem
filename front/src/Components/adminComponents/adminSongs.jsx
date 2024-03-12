import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { setEventsArray } from '../../features/songSlice';
import Swal from "sweetalert2";

function AdminSongs({addEventSidebar}) {
    const [songs, setSongs] = useState([]);
    const [visibleEvents, setVisibleEvents] = useState([]);

    const adminInfo = useSelector((myStore) => myStore.adminSlice.admin);
    const eventsArray = useSelector((myStore) => myStore.songSlice.eventsArray);
    const adminsEvents = eventsArray.filter(event => event.eventAdminId === adminInfo._id);

    //Get all the songs
    const getSongs = () => {
        axios.get('http://localhost:8080/api/songs')
        .then((response) => {
            const sortedSongs = response.data.sort((a, b) => {
                return a.date - b.date;
            });

            setSongs(sortedSongs);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
    }

    //Sends song id and event id, and deletes accordingly.
    const deleteSong = (song, event) => {
        const songId = song.target.id;
        const eventId = event;

        setVisibleEvents(prevState => ({
            ...prevState,
            [eventId]: !prevState[eventId],
        }));

        console.log(songId)
        console.log(eventId)

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete('http://localhost:8080/api/deleteSong',{
                    params: {
                        songId: songId,
                        eventId: eventId
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

    //Make the songs Visible.
    const showSongs = (eventId) => {
        setVisibleEvents(prevState => ({
            ...prevState,
            [eventId]: !prevState[eventId],
        }));
    }

    useEffect(() => {
        getSongs();
    }, [songs]);

    return (
        <div>
            <div>
                {adminsEvents.length > 0 ? '' :
                    <p className="noEvents">No events available, want to add new event? <a className="link" onClick={() => addEventSidebar('closeSidebar')}>Add new event</a></p>
                }
            </div>
            <div className="deleteSongEvents">
                {adminsEvents.map((events) => (
                    <div className='deleteSongEvent' id={events._id} onClick={() => showSongs(events._id)}>
                        <div className="owner">{events.ownerName}'s Event's songs:</div>
                        <div className={`eventsSongs ${visibleEvents[events._id] ? 'show' : 'hide'}`}>
                            {(songs.filter((song) => song.eventId === events._id)).map((song, index) => (
                                <div className='songDelete' key={song._id}>
                                    <button id={song._id} className="deleteSongBTN" onClick={(song) => deleteSong(song, events._id)}>delete {index + 1}.</button>
                                    <span>{song.name}</span>
                                    <span className='deleteSongLikes'>Likes: {song.likes}</span>
                                </div>
                            ))}
                            {songs.filter((song) => song.eventId === events._id).length === 0 && (
                                <div className='noSongsMessage'>No songs chosen yet</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminSongs;
