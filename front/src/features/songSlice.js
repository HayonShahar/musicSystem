import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initValue = {
    eventsArray: [],
    songsArray: [],
    songName: '',
    id: '',
}

const songNameSlice = createSlice({
    name: 'song',
    initialState: initValue,
    reducers:{
        setSongName:(state, action) => {
            state.songName = action.payload;
        },
        setId:(state, action) => {
            state.id = action.payload;
        },
        setSongsArray:(state, action) => {
            state.songsArray = action.payload;
        },
        setEventsArray:(state, action) => {
            state.eventsArray = action.payload;
        }
    }
});

axios.get('http://localhost:8080/api/songs')
.then((response) => {
    const sortedSongs = response.data.sort((a, b) => {
        return b.likes - a.likes;
    });
    console.log(response.data);

    setSongsArray(response.data);
})
.catch((error) => {
    console.error('Error fetching data:', error);
});

export const { setSongName, setId, setSongsArray, setEventsArray } = songNameSlice.actions;
export default songNameSlice.reducer;
