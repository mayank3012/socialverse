import React,{useState,useRef} from 'react';
import {useHistory} from 'react-router-dom';
import M from 'materialize-css';

const Createpost = () => {
    const btn=useRef();
    const history=useHistory();
    const [title,setTitle] = useState("");
    const [body,setBody] = useState("");
    const [photo,setPhoto] = useState("");
    const user = JSON.parse(localStorage.getItem('user'))
    let url="";
    const checkServer=()=>{
        fetch("/Createpost",{
            method:"get",
            headers:{
                "Authorization": "Bearer"+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                history.push('/signin');
                M.toast({html: data.error,classes:"#c62828 red darken-3"});
            }
        }).catch(e=>{
            console.log(e);
            M.toast({html: e,classes:"#c62828 red darken-3"});
        })
    }
    checkServer();
    const postImage = ()=>{
        btn.current.setAttribute("disabled","disabled");
        const data = new FormData();
        data.append("file",photo);
        data.append("upload_preset","socialverse")
        data.append("cloud_name","socialverse")
        fetch("https://api.cloudinary.com/v1_1/socialverse/image/upload",{
            method:"post",
            body:data
        }).then(res=>res.json())
        .then(data=>{
            console.log(data.url);
            url = data.url;
            postImageToServer();
        }).catch(err=>{
            console.log(err)}
        )
        
    }
    const postImageToServer=()=>{
        fetch("/Createpost",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer"+localStorage.getItem("jwt")
            },body:JSON.stringify({
                title,
                body,
                photo:url
            })
        }).then(res=>res.text())
        .then(data=>{
            if(data.error)
                M.toast({html: data.error,classes:"#c62828 red darken-3"});
            else{
                M.toast({html:"Posted Successfully",classes:"#388e3c green darken-2"});
                history.push('/');
            }
            //btn.current.removeAttribute("disabled");
        }).catch(e=>{
            console.log(e);
            M.toast({html: e,classes:"#c62828 red darken-3"});
            //btn.current.removeAttribute("disabled");
        })
    }
    return (
        <>
        {!user?"":
        <div className="containers login">
            <div className="card login-card" >
            <h3 className="col-lg-12 login-header">
                            <i className="fa fa-image" style={{marginRight:"5px"}} aria-hidden="true"></i>
                                Create Post
                </h3>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-2"></div>
                        <div className="col-lg-6 col-md-8 login-box">
                            <div className="col-lg-12 login-form">
                                <div className="col-lg-12 login-form">
                                   <div className="form-group">
                                            <label className="form-control-label">Title</label>
                                            <input type="text" id="title" name="title"
                                            onChange={(e)=>setTitle(e.target.value)}
                                            className="form-control" />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-control-label">Description (Optional)</label>
                                            <textarea id="body" name="body"
                                            onChange={(e)=>setBody(e.target.value)}
                                            ></textarea>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-control-label">Photo</label>
                                            <input type="file" id="photo" name="photo"
                                            onChange={(e)=>setPhoto(e.target.files[0])}
                                            style={{padding:"5px", height:"auto"}} className="form-control" />
                                        </div>
                                        <div className="col-lg-12 loginbttm">
                                            <div className="col-lg-6 login-btm login-text">
                                            </div>
                                            <div className="col-lg-6 login-btm login-button">
                                                <button ref={btn} className="btn btn-outline-primary" onClick={()=>postImage()} >POST</button>
                                            </div>
                                        </div>
                                </div>
                            </div>
                        </div>
                        <div className="login-footer"> 
                              
                        </div>

                    </div>
                </div>
            </div>
        </div>
        }</>
    )
}
export default Createpost;