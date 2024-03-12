import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/home';
import SelectedSong from './Components/selectedSong';
import Login from './Components/login';
import Register from './Components/register';
import Admin from './Components/admin';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import songSlice from './features/songSlice';
import adminSlice from './features/adminSlice';
import './App.css'
import Footer from './Components/footer';

const myStore = configureStore({
  reducer:{
    songSlice,
    adminSlice
  }
})

function App() {
  return (
    <>
    <Provider store={myStore}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/home" element={<Home />} />
          <Route path="/selected" element={<SelectedSong />} />
        </Routes>
      </Router>
      
    </Provider>
    <Footer/>
    </>
  );
}

export default App;
