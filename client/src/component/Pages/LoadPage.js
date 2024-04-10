import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal, Button, Overlay, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function LoadPage(){
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const nowBoard = query.get('board');
    const nowPage = query.get('pages');
    const [loggedin, setLoggedin] = useState(sessionStorage.getItem("loggedin"));
    const [board, setBoard] = useState([]);
    const [maxPage, setMaxPage] = useState(0);
    const boardName = {
        free : "자유 게시판",
        quest : "질문 게시판",
        report : "건의 게시판"
    }

    useEffect(() =>{
        if(maxPage !== 0){
            return;
        }
        fetch(`https://localhost:8080/getMaxBoard/${nowBoard}`, {
            method : "POST",
            headers: {
              "Content-Type": "application/json",
            },

            credentials : "include",
        })
        .then((res) => res.json())
        .then((res) => {
            setMaxPage(() => res.maxPage);
        });
    })

    useEffect(() => {
        if(!['free', 'report', 'quest'].includes(nowBoard)) {
            alert("Invaild Access");
            navigate('/test');
            return;
        }
        
        fetch(`https://localhost:8080/getBoard/${nowBoard}/${nowPage}`, {
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
            {loggedin ? 'true' : 'false'}
            <div className="boardNameIndicate"> 
            {boardName[nowBoard]} 
                <button className="appendBtn" onClick={navigatePost}> Post </button>
            </div>
            {
                [...board].sort((e,t) => {
                    return new Date(t.date)-new Date(e.date)
                }).map((e,i) => {
                    console.log(e);
                    return (
                    <div className="boardComponent" key = {`${e.title}`}>
                        <div className="bc_title" > {e.title} </div>
                        <div className="bc_infos">
                            {["작성자 : "+e.author, e.date.slice(0, 10), '개추 '+e.recommended, "댓글 수 "+Object.keys(e.chat).length]
                            .map((_e, i) => {
                                return <div key={e+_e}> {_e} </div>
                            }) }
                        </div>

                    </div>);
                })
            }
        </div>
    )
}