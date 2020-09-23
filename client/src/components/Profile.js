import React,{useEffect,useState} from 'react'
import { Link,useHistory } from 'react-router-dom'
import M from 'materialize-css'
import profilePic from '../images/avtar.png'

export default function Profile() {
    const history = useHistory();
    const [data, setData] = useState([]);
    const user =JSON.parse( localStorage.getItem("user"));
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

    useEffect(() => {
        fetch("/Profile", {
            headers: {
                "Authorization": "Bearer" + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setData(result.results);
                console.log(result.results)
            }).catch(e => {
                M.toast({ html: e, classes: "#c62828 red darken-3" });
            })
    }, [])
    const logout = () => {
        fetch("/logout", {
            method: "post",
        }).then(res => res.json())
            .then(data => {
                if (data.error)
                    M.toast({ html: data.error, classes: "#c62828 red darken-3" });
                else {
                    localStorage.clear('jwt');
                    localStorage.clear('user');
                    M.toast({ html: "Logout Successfully", classes: "#388e3c green darken-2" });
                    history.push('/Signin');
                }
            }).catch(e => {
                console.log(e);
                M.toast({ html: e, classes: "#c62828 red darken-3" });
            })
    }
    const like=(id)=>{
        fetch("/like",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer"+localStorage.getItem("jwt")
            },body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
                const newData=data.map(item=>{
                    if(item._id===result.result._id){
                        return result.result;
                    }
                    else{
                        return item;
                    }
                })
                setData(newData);
        }).catch(e=>{
            console.log(e);
        })
    }

    const unlike=(id)=>{
        fetch("/unlike",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer"+localStorage.getItem("jwt")
            },body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
         .then(result=>{
            const newData=data.map(item=>{
                if(item._id===result.result._id){
                    return result.result;
                }
                else{
                    return item;
                }
            })
            setData(newData);
        }).catch(e=>{
            console.log(e);
        })
    }
    const comment=(text,postId)=>{
        fetch("/comment",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer"+localStorage.getItem("jwt")
            },body:JSON.stringify({
                postId,
                text,
            })
        }).then(res=>res.json())
        .then(result=>{
                const newData=data.map(item=>{
                    if(item._id===result.result._id){
                        return result.result;
                    }
                    else{
                        return item;
                    }
                })
                console.log(newData)
                setData(newData);
        }).catch(e=>{
            console.log(e);
        })
    }
 
    const deletePost=(postId)=>{
        fetch("/delete/"+postId,{
            method:"delete",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer"+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.filter(item=>{
                return item._id !== postId
            })
            setData(newData)
        }).catch(e=>{
            console.log(e);
        })
    }

    return (
        <>
        {!user?"":
        <div className="containers profile">
            <div className="profile-user">
                <div className="profile-pic">
                    <div>
                    <img className="rounded-circle" src={user.photo!=="no image"?user.photo:profilePic} alt="profile_pic" />
                    <Link to="/edituser" className="a"><i className="fa fa-pencil-square-o" aria-hidden="true"></i></Link>
                    </div>
                </div>
                <div className="profile-info">
                    <h3>{user.name}</h3>
                    <h5> {user.about!==""?user.about:"Add about you"}</h5>
                    <div className="records">
                        <span>
                            <Link className="link" to="">
                                <h5>{data.length} Posts</h5>
                            </Link>
                        </span>
                        <span>
                            <Link className="link" to="">
                            <h5>{!user.follower||user.follower.length<0?"0":user.follower.length} Followers</h5>
                            </Link>
                        </span>
                        <span>
                            <Link className="link" to="">
                            <h5>{!user.following||user.following.length<0?"0":user.following.length} Following</h5>
                            </Link>
                        </span>
                        <span>
                        <Link className="link" to="" onClick={()=>logout()}>
                                <h5>Logout</h5>
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
            <div className="myposts">
            {data.map(item => {
                    return (
                        <div key={item._id}>
                        <div className="likes">
                        <span><img className="rounded-circle" style={{width:"40px",height:"40px",display:"inline-flex"}} src={item.postBy.photo!=="no image"?item.postBy.photo:profilePic} alt="profile_pic" /></span>
                        &nbsp; &nbsp; <span><p style={{display:"inline-flex"}}> {item.postBy.name}</p></span>
                        <span style={{float:"right"}}>
                        <i className="fa fa-trash" onClick={()=>{deletePost(item._id)}} style={{color:"red",cursor:"pointer"}} aria-hidden="true"></i>
                        </span>
                        </div>
                        <img src={item.photo} alt="post img" />
                            <div className="likes">
                                <h4>
                                    {item.likes.includes(user._id)
                                    ?
                                        <i className="fa fa-heart" onClick={()=>{unlike(item._id)}} style={{color:"red"}} aria-hidden="true"></i>
                                    :
                                        <i className="fa fa-heart-o" onClick={()=>{like(item._id)}}  aria-hidden="true"></i>
                                    }           
                                </h4>
                                <h5>{item.likes.length} Likes</h5>
                                <h5>{item.title}</h5>
                                <h6>{item.body}</h6>
                                
                                {<Link to={'/comments/'+item._id}>Show Comments</Link> }
                                <form onSubmit={(e)=>
                                    {
                                    e.preventDefault();
                                    comment(e.target[0].value,item._id)
                                    e.target[0].value=""
                                    }
                                }>
                                    
                                <input type="text" placeholder="Leave a comment" />
                                </form>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
        }</>
    )
}
