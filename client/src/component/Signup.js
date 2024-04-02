import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { SHA256 } from 'crypto-js';



const  validateId = function(id) {
    return /^[a-zA-Z0-9]{5,12}$/.test(id);
}

const validatePss = function(pss) {
    return pss.length >=5;
}

const validateAll = function(id, pss, checkPss) {
    return validateId(id) && validatePss(pss) && pss.hashed === checkPss.hashed;
}

function Signup(){
    const navigate = useNavigate();
    const [isRequired, setIsRequired] = useState({signUp : false, checkId : false});
    const [isNotDuplicated, setIsNotDuplicated] = useState({bool : null, id : null});
    
    const signUp = useCallback(() => {
        if(!isRequired.signUp){
            setIsRequired(()=>Object({...isRequired, signUp : true}));
        }
        else {
            alert("Try again a few momnets later");
        }
    }, [isRequired]);


    const [infos, setInfos] = useState({
        body : '',
        id : '',
        pss : '',
        checkPss : '',
    });

    const [sequence, setSequence] = useState([
        {
            type : 'Name',
            style : {},
            label : 'Name',
            text: "",
            onclickFunc : () => {}
        },
        {
            type : 'Id',
            style : {
                fontSize : '10px',
                fontWeight : '700',
                border : 'solid 1px #000000',
                width : '100px',
                height : "70%",
                lineHeight : "30px",
                borderRadius : "5px",
                backgroundColor : "#CCCCCC"
            },
            label : "ID",
            text : "중복확인",
            onclickFunc : () => {
                if(!isRequired.checkId){
                    setIsRequired(() => {return {...isRequired, checkId : true}})
                }
                else { 
                    alert("Try again in please")
                }
            },
            onkeydownFunc : (e) => {
                if(e.key === 'Enter') {

                }
            }
        },
        {
            type : 'Pss',
            style : {},
            label : "Password",
            text : '',
            onclickFunc : () => {},
        },
        {
            type : 'CheckPss',
            style : {
                fontSize : "10px",
                fontWeight : "700",
            },
            label : "Check Password",
            text : "",
            onclickFunc : () => {}
        },
 
    ])
    
    const [signupBtn, setSignupBtn] = useState({
        setting : {
            style : {
                fontWeight : '400', 
                margin : "10px auto", 
                width : "100px",
                backgroundColor : "#FFDDDD",
            },
            text : "Unaccepted"
        },
        usable : false,
    })

    const signupBtnStyle = useMemo(() => {
        return {
        useable : {
            style : {
                fontWeight : '500', 
                margin : "10px auto", 
                width : "100px"
            },
            text : "sign up"
        },
        unusable : {
            style : {
                fontWeight : '400', 
                margin : "10px auto", 
                width : "100px",
                backgroundColor : "#FFDDDD",
            },
            text : "Unaccepted"
        }
    }}, [])

    useEffect(() => {
        setSignupBtn(() => {
            const res = {...signupBtn};
            res.usable = validateAll(infos.id, infos.pss, infos.checkPss) && isNotDuplicated.bool;
            res.setting = res.usable ? signupBtnStyle.useable : signupBtnStyle.unusable;
            res.onclickFunc = !res.usable ? () => {
                if(!validateId(infos.id)) {
                    alert('Re-enter Id with 5 to 12 length only using alphabet and numbers'); 
                    return;
                }
                if(!validatePss(infos.pss)) {
                    alert('Re-enter Password with 5 to 30 length');
                    return;
                }
                if(infos.pss !== infos.checkPss) {
                    alert('Password and Password Confirmation are incorrect');
                    return;
                }
                if(!isNotDuplicated.bool){
                    alert('Check your Id')
                }
                return;
            } : signUp;
            return res;
        })
    }, [infos, isNotDuplicated])

    useEffect(() => {
        setSequence(() => {
            const res = [...sequence];
            res[3].text = infos.pss.length !== 0 && infos.length !== 0 ? infos.pss.hashed === infos.checkPss.hashed ? '비밀번호가 일치합니다' : '비밀번호가 불일치합니다' : '';
            return res;
        })
    }, [infos])

    useEffect(() => {
        if(!isRequired.signUp) return;
        
        fetch("https://localhost:8080/signup/toSignUp", {
            method : "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body : JSON.stringify({
                "id" : infos.id,
                "pss" : infos.pss,
                "name" : infos.name,
            }),
            credentials: "include",
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            if(!res.Err && res.IsSignedUp){
                alert("Sign Success")
                navigate('/login');
            }
            else {
                setIsRequired(() => {
                        alert("Try again please");
                        console.log(res.ErrMessage);
                        return false;
                    }
                )
            }
        })
        .catch(err => {
            setIsRequired(() => {
                    alert("Fail to Sign up");
                    console.log(err);
                    return {...isRequired, signUp : false};
                }
            )
        });
    }, [isRequired, infos]);

    useEffect(() => {
        console.log(infos.pss);
        if(isNotDuplicated.id !== null && infos.id !== isNotDuplicated.id){
            setIsNotDuplicated(() => Object({bool : null, id : null}))
            setSequence(() => {
                const res = [...sequence];
                res[1].text = "중복확인";
                res[1].style = {...res[1].style, backgroundColor : "#CCCCCC"}
                return res;
            });
        }
    }, [infos])

    useEffect(() => {
        if(!isRequired.checkId) return;
        

        fetch("https://localhost:8080/signup/checkId", {
            method : "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body : JSON.stringify({
                "id" : infos.id,
            }),
            credentials: "include",
        })
        .then(res => res.json())
        .then(res => {
             if(!res.Err){
                setIsRequired(() => {
                    return {...isRequired, checkId:false};
                });
                setSequence(() => {
                    const ret = [...sequence];
                    ret[1].text = res.isNotDuplicated ? "사용 가능" : "사용 불가";
                    ret[1].style = {...ret[1].style, backgroundColor : res.isNotDuplicated ? "#55CC99" : "#CC5555"};
                    return ret;
                });
                setIsNotDuplicated(() => {return {bool : res.isNotDuplicated, id : infos.id}});
             }
             else {
                setIsRequired(() => {
                        alert("Try again please");
                        console.log(res);
                        return {...isRequired, checkId : false};
                    }
                )
            }
        })
        .catch(err => {
            setIsRequired(() => {
                    alert("Fail to Sign up");
                    console.log(err);
                    return {...isRequired, checkId : false};
                }
            )
        });
    }, [isRequired, infos]);

    const getFunction = useMemo(() => {
        return { 
        Name : (e) => {
            setInfos(() => {
                const res = {...infos};
                res.name = e.target.value;
                return res;
            })
        },
        Id : (e) => {
            setInfos(() => {
                const res = {...infos};
                res.id = e.target.value;
                return res;
            })
        },
        Pss : e => {
            setInfos(() => {
                const res = {...infos};
                res.pss = {
                    hashed:SHA256(e.target.value).toString(),
                    length:e.target.value.length
                };
                return res;
            })
        },
        CheckPss : e => {
            setInfos(() => {
                const res = {...infos};
                res.checkPss = {
                    hashed:SHA256(e.target.value).toString(),
                    length:e.target.value.length
                };
                return res;
            })
        }}
    }, [infos])

    


    return (
        <div className = "center" style = {{height : "80%"}}>
            <div className="text">
                <h1 style={{
                color:"#FFDEEE",
                textShadow : "0px 2px 4px gray",
                fontWeight:"700",
                }}>Sign Up</h1>
            </div> 

            <div id="signup">
                {sequence.map(e => {
                    return <div className="signupele" style={{}} key = {e.type}>        
                        <div className = "signuptbLabel"> 
                            <div className="signuptbLabelele">
                                {e.label}
                            </div>
                        </div>
                        <form className="signuptbEnterele">
                            <input className="signuptbInput" name={"signuptbInput"+e.type} 
                                   type = {['Pss', 'CheckPss'].includes(e.type) ? "password" : null}
                                   autoComplete="off"
                                   onChange = {getFunction[e.type]} />
                            <div className="singuptbInputText" 
                                 style={e.style}
                                 onClick = {e.onclickFunc}> {e.text} </div>
                        </form>
                    </div>
                })}
                <div id="sub" style = {signupBtn.setting.style} onClick = {signupBtn.onclickFunc}> {signupBtn.setting.text} </div>
            </div>
        </div>
        
    )
}

export default Signup;