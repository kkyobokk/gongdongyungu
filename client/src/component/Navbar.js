import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import '../App.css';

const Navbar = ()=>{
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <div className="navlist" onClick={() => {navigate("/test?board=free")}}> 자유 게시판 </div>
            <div className="navlist" onClick={() => {navigate("/test?board=quest")}}> 질문 게시판 </div>
            <div className="navlist" onClick={() => {navigate("/test?board=report")}}> 건의 게시판 </div>
            <div className="navlist" style={{float : "right", display:"flex", gap:"15%", width:"20%"}}>
                <div onClick={() => {navigate("/login")}} style={{fontSize :"70%"}}> 로그인 </div>
                <div onClick={() => {navigate("/signup")}} style={{fontSize :"70%"}}> 회원가입 </div>
            </div>
        </nav>
    );
};

export default Navbar;