import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export default function PostBoard(){
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const nowBoard = query.get('board');
    const [contents, setContents] = useState({title:'', body:''});
    const [require, setRequire] = useState(false);
    const temp = `#include <stdio.h>
#include <stdlib.h>
  
int main(void){
int N;
scanf("%d", &N);
for(int i = 0; i< N; i++) 
}`;

    const getTitle = useCallback(e => {
        setContents(() => {return{...contents, title : e.target.value};})
    }, [contents]);

    const getBody = useCallback(e => {
        console.log(e.target.value);
        setContents(() => {return{...contents, body : e.target.value};})
    }, [contents]);

    const postContents = () => {
        if(!require){
            setRequire(() => true);
        }
        else {
            alert("Please Wait for a moment");
        }
    }

    useEffect(() => {
        if(!require) return;
        console.log(1);
        fetch(`https://localhost:8080/write/${nowBoard}`, {
            method : "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body : {
                'contents' : contents,
                'id' : null,
            },
            credentials : "include",
        })
        .then(res => res.json())
        .then(res => {

        })
        .catch(err => console.log(err));

    }, [require])

    return (
        <div className="loadPage" >
            <div className="center" style={{marginTop : "30px", textAlign:"left", width : "80%", height : "80%"}}>
                <label className="postWrite_label">
                    제목 <input onChange={getTitle} className="postWrite_title" placeholder="제목을 입력해주세요"></input></label>
                <textarea onChange={getBody} className="postWrite" placeholder="Invaild Access">
                </textarea>
                <button className="appendBtn" onClick={postContents}
                style={{height : "40px", fontSize:"24px", margin : "0 auto", marginTop : "20px"}}> Post </button>
            </div>
        </div>
    );
}