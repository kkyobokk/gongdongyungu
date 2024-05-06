import React, {useEffect, useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCookies } from 'react-cookie';
import temp from "../img/temp.png";
import '../App.css';

const Navbar = ()=>{
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);
    const [ cookie, setCookie, removeCooki ] = useCookies(['id']);

    useEffect(() => {
        //console.log(a);
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
                if(res.Err) console.err(res.ErrMessage);
            }
            else {
                setLoggedIn(() => {
                    //console.log("is Logged in : ", res.LoggedIn);
                    return true;
                });
            }
        })
        .catch(err => {
            console.err(err);
        });
    }, [])

    return (
        <nav className="navbar">
            <Link to="/test?baord=main" style={{width : "60px", height : "60px", marginLeft:"3%",position : "absolute"}}><img  onClick={() => {navigate("/test?board=main")}} src={temp} style={{width : "60px", height : "60px", marginLeft:"3%",position : "absolute"}}/></Link>
            
            <div style={{width : "50px"}}/>
            <Link className="navlist" to="/test?board=free"  > 자유게시판 </Link>
            <Link className="navlist" to="/test?board=quest" > 질문게시판 </Link>
            <Link className="navlist" to="/test?board=report"  > 건의게시판 </Link>
            <div className="navlist" key={loggedIn} style={{float : "right", display:"flex", gap:"15%", width:"20%"}}>
                {
                    !loggedIn ? <>
                    <Link className="navlist" to="/login"  style={{fontSize:"70%"}}> 로그인 </Link>
                    <Link className="navlist" to="/signup"  style={{fontSize:"70%"}}> 회원가입 </Link>
                    </>
                    :
                    <div> 환영합니다 </div>

                }
            </div>
        </nav>
    );
};

export default Navbar;