import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { SHA256 } from 'crypto-js';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = function() {
  const navigate = useNavigate();
  const [cookie, setCookie, removeCookie ] = useCookies(['id']);

  const [pss, setPss] = useState('');
  const [id, setId] = useState('');
  const [toKeepLogin, setToKeepLogin] = useState(false);
  const [isRequired, setIsRequired] = useState(false);


  const getId = e => {
    setId(() => {
      return e.target.value;
    })
  }
  const getPss = e => {
    setPss(() => {
      return SHA256(e.target.value);
    })
  }
  const getToKeepLogin = e => {
    setToKeepLogin(() => {
      return e.target.checked
    });
  }

  useEffect(() => {
    console.log(SHA256(id).toString());
  })

  useEffect(() => {
    if(!isRequired) return;

    fetch("https://localhost:8080/login", {
      method : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body : JSON.stringify({
        "id" : id,
        "pss" : pss,
        "tokeepLogin" : toKeepLogin,
      }),
      credentials: "include",
    })
    .then(res => res.json())
    .then(res => {
      if(!res.Err){
        if(typeof(res.Err) === "number"){
          alert(res.ErrMessage);
          setIsRequired(() => false);
        }
        else {
          sessionStorage.setItem("name",res.name)
          sessionStorage.setItem("loggedin", res.Loggedin)
          localStorage.setItem('token', res.token);
          setCookie('id', SHA256(id).toString());
          alert("Login Success");
          navigate(`/test`);
        }
      }
      else {
        alert("Fail to Login2");
        console.log(res.ErrMessage);
        setIsRequired(() => false);
      }
    })
    .catch(err => {
      alert("Fail to Login");
      setIsRequired(() => false);
      console.log(err);
    });
  }, [isRequired, id, pss]);

  const sendIDandPassword = useCallback(() => {
    if(!isRequired) {
      setIsRequired(()=>true);
    }
    else {
      alert("Try again in few moments")
    }
  }, [isRequired]);

  return (
    <div className="center" style= {{gap:"20px"}}>
      <div className="login">
        <div className="text">
          <h1 style={{
            color:"#FFDEEE",
            textShadow : "0px 2px 4px gray",
            fontWeight:"700",
            }}>List<br/>Manage</h1>
        </div>
        <br/>
        <div className="posting">
          <input type="text" name="id" id="id" className="postele" placeholder="get ID" 
          onChange={getId}/>
          <input type="password" name="pss" id="pss" className="postele" placeholder="get Password"
          onChange={getPss}/>
          <div id="sub" className="postele" 
            onClick={sendIDandPassword}> login </div>
        </div>

        <div className="keeplogin">
          <label style={{"display":"inline-block"}}>
            <span id="keeploginText"> to keep login </span>
            <input onClick = {getToKeepLogin} type="checkbox"/>  
          </label>
        </div>

      </div>
      </div>
  )
}

export default Login;