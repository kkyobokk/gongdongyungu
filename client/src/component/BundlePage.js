import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from "./Navbar.js";
import MainPage from "./Pages/MainPage.js";
import FreePage from "./Pages/FreePage.js";
import QuestPage from "./Pages/QuestPage.js";
import ReportPage from "./Pages/ReportPage.js";
import LoadBoard from './Pages/LoadBoard.js';
import '../App.css';

export default function BundlePage(){

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const nowBoard = query.get('board');
    
    const PageObejct = useMemo(() => {
        return {
        main : (
            <MainPage/>
        ),
        free : (
            <FreePage/>
        ),
        quest : (
            <QuestPage/>
        ),
        report : (
            <ReportPage/>
        ),
        load : (
            <LoadBoard/>
        )
    }}, [])

    
    useEffect(()=>{
        //console.log(query.get('board'));
    }, [])

    return (
        <div style={{width:"100%"}}>
            <Navbar/>
            {(PageObejct[nowBoard !== null ? nowBoard : 'main'])}

        </div>
    )
}