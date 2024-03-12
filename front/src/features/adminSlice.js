import { createSlice } from "@reduxjs/toolkit";

const initValue = {
    admin: []
}

const adminSlice = createSlice({
    name: 'admin',
    initialState: initValue,
    reducers:{
        setAdminData:(state, action) => {
            state.admin = action.payload;
        }
    }
});


export const { setAdminData } = adminSlice.actions;
export default adminSlice.reducer;
