import React, {useState, useCallback} from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';

export default function MainPage(){
    
    return (
        <div className="topSite">
            <div className="site">
                <div className="siteEle">
                    자유 게시판
                </div>
            </div>
            <div className="site">
                <div className="siteEle">
                    질문 게시판
                </div>
            </div>
        </div>
    )
}