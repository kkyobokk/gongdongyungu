import React, {useEffect, useState, useMemo} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCookies } from 'react-cookie';
import '../App.css';

const Navbar = ()=>{
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);
    const [ cookie, setCookie, removeCooki ] = useCookies(['id']);
    const [name, setName] = useState(sessionStorage.getItem("name"));
    
    useEffect(() => {
        console.log(cookie.id);
        cookie.id !== undefined && fetch('https://localhost:8080/login/session', {
            method : "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body : JSON.stringify({
                'id' : cookie.id,
            }),
            credentials : "include",
        })
        .then(res => res.json())
        .then(res => {
            if(!res.LoggedIn) {
                console.log(res);
            }
            else {
                setLoggedIn(() => {
                    console.log("is Logged in : ", res.LoggedIn);
                    return true;
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
    }, [])
    

    useEffect(() => {
        console.log(cookie.id);
    }, [])

    return (
        <nav className="navbar">
            <div className="navlist" onClick={() => {navigate("/test?board=free")}}> 자유 게시판 </div>
            <div className="navlist" onClick={() => {navigate("/test?board=quest")}}> 질문 게시판 </div>
            <div className="navlist" onClick={() => {navigate("/test?board=report")}}> 건의 게시판 </div>
            <div className="navlist" key={loggedIn} style={{float : "right", display:"flex", gap:"15%", width:"20%"}}>
                {
                    !loggedIn ? <>
                    <div onClick={() => {navigate("/login")}} style={{fontSize :"70%"}}> 로그인 </div>
                    <div onClick={() => {navigate("/signup")}} style={{fontSize :"70%"}}> 회원가입 </div>
                    </>
                    :
                    <div> 환영합니다 {name}님</div>

                }
            </div>
        </nav>
    );
};

export default Navbar;