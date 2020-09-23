import React,{useEffect,useState, useRef} from 'react'
import { Link,useHistory ,useParams} from 'react-router-dom'
import M from 'materialize-css'
import profilePic from '../images/avtar.png'

export default function Profile() {
    const history = useHistory();
    const fbtn = useRef();
    const {id}=useParams();
    const [data, setData] = useState(null);
    const [userdata, setUserData] = useState(null);
    const user =JSON.parse( localStorage.getItem("user"));
    useEffect(()=>{
        if(!user){
            history.push("/signin")
        }
    })

    useEffect(() => {
        fetch(`/serchUser/${id}`, {
            headers: {
                "Authorization": "Bearer" + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                setData(result.posts);
                setUserData(result.user)
            }).catch(e => {
                M.toast({ html: e, classes: "#c62828 red darken-3" });
            })
    }, [])
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

    const follow=()=>{
        fbtn.current.setAttribute("disabled","disabled");
        fetch("/followUser",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer"+localStorage.getItem("jwt")
            },body:JSON.stringify({
                followId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            setUserData(result.result)
            console.log(result.resl)
            localStorage.setItem('user',JSON.stringify(result.resl))
        })
        fbtn.current.removeAttribute("disabled");
    }

    const unfollow=()=>{
        fetch("/unfollowUser",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer"+localStorage.getItem("jwt")
            },body:JSON.stringify({
                followId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            setUserData(result.result)
            console.log(result.resl)
            localStorage.setItem('user',JSON.stringify(result.resl))
        })
    }
    return (
        <>
        {!data||!userdata?<h2 className="loading">Loading...</h2>:
        <div className="containers profile">
            <div className="profile-user">
                <div className="profile-pic">
                    <div>
                    <img className="rounded-circle" src={userdata.photo!=="no image"?userdata.photo:profilePic} alt="profile_pic" />
                    </div>
                </div>
                <div className="profile-info">
                    <h3>{userdata.name}</h3>
                    <h4 style={{color:"rgba(56, 51, 51, 0.711)"}}>{userdata.userName}</h4>
                    <h5> {userdata.about!==""?userdata.about:"Add about you"}</h5>
                    <div className="records">
                        <span>
                            <Link className="link" to="">
                                <h5>{data.length} Posts</h5>
                            </Link>
                        </span>
                        <span>
                            <Link className="link" to="">
                                <h5>{!userdata.follower||userdata.follower.length<0?"0":userdata.follower.length} Followers</h5>
                            </Link>
                        </span>
                        <span>
                            <Link className="link" to="">
                                <h5>{!userdata.following||userdata.following.length<0?"0":userdata.following.length} Following</h5>
                            </Link>
                        </span>
                    </div>
                    <div className="records">
                        <span>
                        {userdata.follower.includes(user._id)
                                    ?
                                    <button className="btn btn-outline-info" onClick={()=>unfollow()}>
                                        Unfollow
                                    </button>
                                    :
                                    <button ref={fbtn} type="button" className="btn btn-info" onClick={()=>follow()}>
                                        Follow
                                    </button>

                                    }  
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
       }
       </>
    )
}
