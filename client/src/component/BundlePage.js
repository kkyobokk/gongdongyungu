import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, useNavigate, Routes, Route, useLocation } from 'react-router-dom';
//import { Navbar, Nav, Container } from 'react-bootstrap';
import Navbar from "./Navbar.js";
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function MainPage(){

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const nowBoard = query.get('board');
    const PageObejct = {
        main : (
            <div className="site">
                <div style={{textAlign:"center", width : "90%", margin : "auto auto",
                fontWeight:"700", lineHeight:"40px", fontSize : "18px",
                borderBottom : "solid #000000 3px"}}>
                    자유 게시판
                </div>
            </div>),

        free : (
        <div>
            Hello Free Page
        </div>),

        quest : (
        <div>
            Hello Q
        </div>),

        report : (
        <div>
            Hello R
        </div>)
    }

    
    useEffect(()=>{
        console.log(query.get('board'));
    }, [])

    return (
        <div style={{width:"100%"}}>
            <Navbar/>
            {PageObejct[nowBoard !== null ? nowBoard : 'main']}

        </div>
    )
}