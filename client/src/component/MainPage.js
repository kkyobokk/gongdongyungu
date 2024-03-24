import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
//import { Navbar, Nav, Container } from 'react-bootstrap';
import Navbar from "./Navbar.js";
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function MainPage(){
    return (
        <div style={{width:"100%"}}>
            <Navbar/>
        </div>
    )
}