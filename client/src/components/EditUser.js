import React,{useState,useRef,useEffect} from 'react';
import {useHistory} from 'react-router-dom'
import M from 'materialize-css';
export default function Edituser() {
    const btn = useRef();
    const history=useHistory();
    const [name,setName] = useState("");
    const [about,setAbout] = useState("");
    const [photo,setPhoto] = useState("");
    const user =JSON.parse(localStorage.getItem("user"))
    let url=user.photo;;
    useEffect(()=>{
        setAbout(user.about);
        setName(user.name);
    },[])
    const _id = user._id;
    const userName=user.userName;
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
            url = data.url;
            postImageToServer();
        }).catch(err=>{
            console.log(err)}
        )
        
    }
    const postImageToServer=()=>{
        fetch("/edituser",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer"+localStorage.getItem("jwt")
            },body:JSON.stringify({
                name,
                about,
                photo:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error)
                M.toast({html: data.error,classes:"#c62828 red darken-3"});
            else{
                const user1 = {
                    _id,
                    userName,
                    name,
                    about,
                    photo:url
                }
                localStorage.setItem("user",JSON.stringify(user1));
                M.toast({html:"Updated Successfully",classes:"#388e3c green darken-2"});
            }
            history.push('/profile');
        }).catch(e=>{
            M.toast({html: e,classes:"#c62828 red darken-3"});
        })
    }
    return (
        <>
        {!user?"":
            <div className="containers login">
            <div className="card login-card" >
            <div className="col-lg-12 login-header">
                            <i className="fa fa-key" style={{marginRight:"5px"}} aria-hidden="true"></i>
                                Edit
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
                                            <input type="text" className="form-control" name="about" 
                                            id="about" value={about} onChange={(e)=> setAbout(e.target.value)} />
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
                                                <button ref={btn} className="btn btn-outline-primary" onClick={()=>{photo?postImage():postImageToServer()}}>Update</button>
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
        } </>
    )
}
