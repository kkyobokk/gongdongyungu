import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LoadPage(){
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const nowBoard = useCallback(()=>query.get('board'), []);
    const nowPage = useCallback(()=>query.get('pages'), []);
    const [loggedin, setLoggedin] = useState(sessionStorage.getItem("loggedin"));
    const [board, setBoard] = useState([]);
    const [maxPage, setMaxPage] = useState(0);
    const [require, setRequire] = useState({
        getBoard : false,
    })
    const [gotoBoard, setGotoBoard] = useState(null);
    const boardName = useCallback({
        free : "자유 게시판",
        quest : "질문 게시판",
        report : "건의 게시판"
    }, []);

    const getBoard = useCallback((e) => {
        console.log(e.target.dataset.id);
        console.log(e.target);
        if(require.getBoard === false){
            setRequire(() => {
                const res = {...require, getBoard : e.target.dataset.id};
                //console.log(res);
                return res;
            })
        }
        else {
            alert("Wait a moment");
        }
    });

    const Ref = useRef([]);

    useEffect(() =>{
        if(maxPage !== 0){
            return;
        }
        fetch(`https://localhost:8080/getMaxBoard/${nowBoard()}`, {
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
        console.log(maxPage);
    }, [])

    useEffect(() => {
        if(!['free', 'report', 'quest', null].includes(nowBoard())) {
            console.log(nowBoard());
            alert("Invaild Access");
            navigate('/test');
            return;
        }
        
        fetch(`https://localhost:8080/getBoard/${nowBoard()}/${nowPage()}`, {
            method : "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials : "include",
        })
        .then((res) => res.json())
        .then((res) => {
            console.log("Res", res);
            setBoard(() => res.contents.sort((e,t) => {
                return new Date(t.date)-new Date(e.date)
            }));
        });
    }, []);

    useEffect(() => {
        if(require.getBoard === false) return;
        console.log(require.getBoard);
        navigate(`/test?board=load&bQuery=${nowBoard()}&bId=${board[require.getBoard].hash.toString().replace(/\//g, "_")}`)
    }, [require])

    const navigatePost = useCallback(() => {
        if(!loggedin) return alert("Try to Log in")
        navigate(`/test?board=${nowBoard()}&write=true`);
    }, []);

    // useEffect(() => {
    //     console.log(maxPage);
    // }, [maxPage]);


    return (
        <div className="loadPage">
            <div className="boardNameIndicate"> 
            {boardName[nowBoard()]} 
                <button className="appendBtn" onClick={navigatePost}> Post </button>
            </div>
            {
                [...board].map((e,i) => {
                    console.log(e);
                    return (
                    <div className="boardComponent" key = {`${e.title}`}
                    data-id = {i}
                    onClick={getBoard}
                    ref={e => Ref.current[i] = e}>
                        <div className="bc_title" data-id = {i} > {e.title} </div>
                        <div className="bc_infos" data-id = {i}>
                            {["작성자 : "+e.author, e.date.slice(0, 10), '개추 '+e.recommended, "댓글 수 "+e.chatNumber]
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