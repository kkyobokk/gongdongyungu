import React from 'react';
import { useLocation } from 'react-router-dom';
import LoadPage from './LoadPage';
import PostBoard from './PostBoard';
import '../../App.css';

export default function FreePage(){
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const doWrite = query.get('write');
    
    return (
        <div className="page">
            {
                doWrite==="true" ?
                <PostBoard /> 
                :
                <LoadPage />
            }
        </div>
    )
}