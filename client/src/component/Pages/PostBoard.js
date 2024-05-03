import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

export default function PostBoard(){
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const nowBoard = query.get('board');
    const [contents, setContents] = useState({title:'', body:''});
    const [require, setRequire] = useState(false);
    const [name,setName] = useState(sessionStorage.getItem("name"));
    const [loggedin, setLoggedin] = useState(sessionStorage.getItem("loggedin"));
    const [cookie,setCookie,removeCookie] = useCookies(["id"]);

    const getTitle = useCallback(e => {
        setContents(() => {return{...contents, title : e.target.value};})
    }, [contents]);

    const getBody = useCallback(e => {
        //console.log(e.target.value);
        setContents(() => {return{...contents, body : e.target.value};})
    }, [contents]);

    const postContents = useCallback(() => {
        if(!require){
            setRequire(() => true);
        }
        else {
            alert("Please Wait for a moment");
        }
    }, [require]);

    useEffect(() => {
        if(!loggedin) {
            alert("Invalid Access");
            navigate(-1);
            return;
        }
        if(!require) return;
        fetch(`https://localhost:8080/write/${nowBoard}`, {
            method : "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body : JSON.stringify({
                "id" : cookie.id,
                "contents" : contents,
                "name" : name,
            }),
            credentials : "include",
        })
        .then(res => res.json())
        .then(res => {
            if(res.Written){
                alert("Writing Success");
                navigate(`/test?board=${nowBoard}`);
            }
            else {
                alert("Writing Failed");
                setRequire(() => false);
            }
        })
        .catch(err => {
            setRequire(() => false);
            console.err(err)
        });
        //console.log(cookie.id);

    }, [require])

    return (
        <div className="loadPage" >
            <div className="center" style={{marginTop : "0", textAlign:"left", width : "80%", height : "89%"}}>
                <label className="postWrite_label">
                    제목 <input onChange={getTitle} className="postWrite_title" placeholder="제목을 입력해주세요"></input></label>
                <textarea onChange={getBody} className="postWrite" placeholder="Invaild Access">
                </textarea>
                <div style={{width : "70%", margin : "0 auto", height : "10%", display:"flex"}}>
                   <button className="appendBtn" onClick={postContents}
                    style={{height : "40px", fontSize:"24px", marginLeft : "auto"}}> Post </button>
                </div>
            </div>
        </div>
    );
}