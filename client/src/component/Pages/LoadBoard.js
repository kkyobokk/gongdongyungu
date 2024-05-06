import React, {useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import "../../App.css";

export default function LoadBoard() {
    const chatRef = useRef(null);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const bId = useCallback(encodeURIComponent(query.get('bId')), []);
    const bQuery = useCallback(query.get('bQuery'), []);
    const [board, setBoard] = useState(null);
    const [appendingChat, setAppendingChat] = useState('');
    const [name,setName] = useState(sessionStorage.getItem("name"));
    const [loggedin, setLoggedin] = useState(sessionStorage.getItem("loggedin"));
    const [require, setRequire] = useState({
        appendChat : false,
        updateBoard : true,
    });

    const resizeChatHeight = useCallback((e) => {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 3 + 'px';
    }, [])

    const getChat = useCallback((e) => {
        setAppendingChat(() => e.target.value);
    }, [appendingChat]);

    const exchangeChat = useCallback((e) => {
        resizeChatHeight(e);
        getChat(e);
    }, [getChat])

    const postChat = useCallback(() => {
        if(!require.appendChat){
            setRequire(() => {return{...require, appendChat : true}});
        }
        else {
            alert("Wait a Moment");
        }
    })

    useEffect(() => {

    }, [])

    useEffect(() => {
        console.log(appendingChat);
    }, [appendingChat]);


    useEffect(() => {
        if(require.appendChat) {
            fetch(`https://localhost:8080/write/chat/${bQuery}/${bId}`, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                author : name,
                chat : appendingChat,
            }),
            credentials : "include",
            })
            .then(res => res.json())
            .then(res => {
                console.log("Appedning Chat Success");
                setAppendingChat(() => {
                    chatRef.current.value = '';
                    chatRef.current.style.height = 'auto';
                    return '';
                })
                setRequire(() => {return{...require, appendChat : false, updateBoard : true}});
            })
            .catch(err => {
                console.err(err);
                alert("Try Again Please");
                setRequire(() => {return{...require, appendChat : false}});
            })
        }

        if(require.updateBoard){
            fetch(`https://localhost:8080/get/${bQuery}/${bId}`, {
                method : "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials : "include",
            })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                if(!res.Err){
                    setBoard(() => res.Board);
                    setRequire(() => {return{...require, updateBoard : false}})
                }
                else {
                    console.err(res.ErrMessage);
                    alert("Data wasn't Gotten, Refresh Please");
                }
            })
            .catch((err)=>{
                console.err(err);
                alert("Data wasn't Gotten, Refresh Please");
            })
        }

    }, [require]);




    return (
        <div className="center" style={{width : "98%", margin : "0 auto", height : "98%", overflow:"scroll", display:"block",backgroundColor : "#FFFFFF"}}>
            {board !== null ? <>
            <div className="board_header"> 
                <div className="board_title">{board.header.title} </div>
                <div className="board_info">
                    <div className="board_author">{board.header.author}</div>
                    <div className="board_timestamp">{board.header.date.slice(0, 10)}</div>
                </div>
            </div>

            <div className="board_body"> 
                {board.content.split("\n").map(e => {console.log(e); return <>{e}<br/></>} )} 
            </div>
            
            <div className="board_chat">
                <div className="board_chat_head">
                    댓글
            
                { loggedin ?         
                    <>
                    <textarea ref={chatRef} rows="1" className="write_chat" onChange={exchangeChat} placeholder="댓글 쓰기" />
                    
                    <div style={{width : "100%", margin : "auto auto" }}></div>
                    <button onClick={postChat} className="post_chat"> 추가 </button>
                    </>
                    : <></>
                }
                </div>
                {board.chat.map(e => 
                <div className="board_chat_ele" key={e.hash}>
                    <div className="chat_ele_author">
                        {e.author}
                    </div>
                    <div className="chat_ele_content">
                        {e.content.split("\n").map(e => {console.log(e); return <>{e}<br/></>})}
                    </div>
                </div>)}
            </div>
            </>
        : <div/>}
        </div>
    )
}