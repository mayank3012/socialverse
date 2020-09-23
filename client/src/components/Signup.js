import React,{useState} from 'react';
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css'
const Signup = () => {
    const history = useHistory();
    const [name,setName] = useState("");
    const [userName,setUserName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const checkServer=()=>{
        fetch("/Signup",{
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
        console.log("start")
        fetch("/Signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },body:JSON.stringify({
                name,
                userName,
                email,
                password
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error)
                M.toast({html: data.error,classes:"#c62828 red darken-3"});
            else{
                M.toast({html: data.messege,classes:"#388e3c green darken-2"});
                history.push('/signin');
            }
            console.log("end")
        }).catch(e=>{
            M.toast({html: "Undefined Error Please try after some time",classes:"#c62828 red darken-3"});
            console.log(e);
        })
    }
    return (
        <div className="containers login">
            <div className="card login-card" >
            <div className="col-lg-12 login-header">
                            <i className="fa fa-key" style={{marginRight:"5px"}} aria-hidden="true"></i>
                                SignUp
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-2"></div>
                        <div className="col-lg-6 col-md-8 login-box">
                            <div className="col-lg-12 login-form">
                                <div className="col-lg-12 login-form">
                                        <div className="form-group">
                                            <label className="form-control-label">NAME</label>
                                            <input type="text" className="form-control" name="name"
                                             id="name" value={name} onChange={(e)=> setName(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-control-label">USER NAME</label>
                                            <input type="text" className="form-control" name="userName" 
                                            id="userName" value={userName} onChange={(e)=> setUserName(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-control-label">EMAIL</label>
                                            <input type="email" className="form-control" name="email"
                                            id="email" value={email} onChange={(e)=> setEmail(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-control-label">PASSWORD</label>
                                            <input type="password" className="form-control" name="password"
                                            id="password" value={password} onChange={(e)=> setPassword(e.target.value)} required />
                                        </div>

                                        <div className="col-lg-12 loginbttm">
                                            <div className="col-lg-6 login-btm login-text">
                                            </div>
                                            <div className="col-lg-6 login-btm login-button">
                                                <button className="btn btn-outline-primary" onClick={()=>postData()}>SignUp</button>
                                            </div>
                                        </div>
                                </div>
                            </div>
                        </div>
                        <div className="login-footer"> 
                               <p>Already Have An Account <Link to="/login">Login</Link></p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
export default Signup;