import React,{useState,useRef} from 'react';
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css';
const Signin = () => {
    const btn=useRef();
    const history = useHistory();
    const [userName,setUserName] = useState("");
    const [password,setPassword] = useState("");
    const checkServer=()=>{
    fetch("/Signin",{
        method:"get",
        headers:{
            "Authorization": "Bearer"+localStorage.getItem("jwt")
        }
    }).then(res=>res.json())
    .then(data=>{
        if(data.error){
            M.toast({html: data.error,classes:"#c62828 red darken-3"});
            history.push('/')
        }
    }).catch(e=>{
        console.log(e);
        M.toast({html: e,classes:"#c62828 red darken-3"});
    })
}
checkServer();
    const postData=()=>{
        btn.current.setAttribute("disabled","disabled");
        fetch("/Signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
            },body:JSON.stringify({
                userName,
                password
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error,classes:"#c62828 red darken-3"});
                btn.current.removeAttribute("disabled");
            }
            else{
                localStorage.setItem('jwt',data.token);
                localStorage.setItem('user',JSON.stringify(data.user));
                M.toast({html:"SignedIn Successfully",classes:"#388e3c green darken-2"});
                console.log("Data Sent");
                btn.current.removeAttribute("disabled");
                history.push('/');
            }
        }).catch(e=>{
            console.log(e);
            M.toast({html: e,classes:"#c62828 red darken-3"});
            console.log("Data Sent");
            btn.current.removeAttribute("disabled");
        })
    }

    return (
        <div className="containers login">
            <div className="card login-card" >
            <div className="col-lg-12 login-header">
                            <i className="fa fa-key" style={{marginRight:"5px"}} aria-hidden="true"></i>
                                LOGIN
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-2"></div>
                        <div className="col-lg-6 col-md-8 login-box">
                            <div className="col-lg-12 login-form">
                                <div className="col-lg-12 login-form">
                                        <div className="form-group">
                                            <label className="form-control-label">USERNAME</label>
                                            <input type="text" className="form-control" id="userName"
                                             name="userName" value={userName} onChange={(e)=>setUserName(e.target.value)} required/>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-control-label">PASSWORD</label>
                                            <input type="password" className="form-control" id="password" 
                                            name="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
                                        </div>

                                        <div className="col-lg-12 loginbttm">
                                            <div className="col-lg-6 login-btm login-text">
                                            </div>
                                            <div className="col-lg-6 login-btm login-button">
                                                <button ref={btn} className="btn btn-outline-primary" onClick={()=>postData()}>LOGIN</button>
                                            </div>
                                        </div>
                                </div>
                            </div>
                        </div>
                        <div className="login-footer"> 
                               <p>Don't Have An Account <Link to="/signup">SignUp</Link></p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
export default Signin;