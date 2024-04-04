import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal, Button, Overlay, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function LoadPage(){
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const nowBoard = query.get('board');
    const [board, setBoard] = useState([]);
    const boardName = {
        free : "자유 게시판",
        quest : "질문 게시판",
        report : "건의 게시판"
    }

    useEffect(() => {
        if(!['free', 'report', 'quest'].includes(nowBoard)) {
            alert("Invaild Access");
            navigate('/test');
            return;
        }
        
        fetch(`https://localhost:8080/getBoard/${nowBoard}`, {
            method : "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials : "include",
        })
        .then((res) => res.json())
        .then((res) => {
            console.log(res);
            setBoard(() => res.contents);
        });
    }, [nowBoard]);

    const navigatePost = () => {
        navigate(`/test?board=${nowBoard}&write=true`);
    }


    return (
        <div className="loadPage">
            <div className="boardNameIndicate"> 
            {boardName[nowBoard]} 
                <button className="appendBtn" onClick={navigatePost}> Post </button>
            </div>
            {
                [...board].map((e,i) => {
                    console.log(e);
                    return (
                    <div className="boardComponent">
                        <div className="bc_title"> {e.title} </div>
                        <div className="bc_infos">
                            {[e.author, e.date.slice(0, 10), '개추 '+e.recommended, "댓글 수 "+Object.keys(e.chat).length]
                            .map(e => {
                                return <div> {e} </div>
                            }) }
                        </div>

                    </div>);
                })
            }
        </div>
    )
}