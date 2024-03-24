import React from "react";
import '../App.css';

const Navbar = ()=>{
    return (
        <nav className="navbar">
            <div className="navlist"> 자유 게시판 </div>
            <div className="navlist"> 질문 게시판 </div>
            <div className="navlist"> 건의 게시판 </div>
            <div className="navlist" style={{float : "right", display:"flex", gap:"15%", width:"20%"}}>
                <div style={{fontSize :"70%"}}> 로그인 </div>
                <div style={{fontSize :"70%"}}> 회원가입 </div>
            </div>
        </nav>
    );
};

export default Navbar;