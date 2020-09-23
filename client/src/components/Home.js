import React, { useState, useEffect } from 'react';
import M from 'materialize-css';
import  { useHistory, Link } from 'react-router-dom'
import profilePic from '../images/avtar.png'

const Home = () => {
    const history = useHistory();
    const [data, setData] = useState(null);
    const user =JSON.parse( localStorage.getItem("user"));
   useEffect(()=>{
       if(localStorage.getItem("user")){
           history.push('/');
       }
       else{
           history.push('/signin')
       }
   })
    useEffect(() => {
        fetch("/Home", {
            headers: {
                "Authorization": "Bearer" + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setData(result.results);
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
    return (
        <>
        {!user||!data?<h2 className="loading">Loading...</h2>:
        <div className="containers">
            <div className="home-header">
                <img src={user.photo!=="no image"?user.photo:profilePic} alt="profile img" />
                <h3>{user.name}</h3>
            </div>
            <div className="homeposts">
                {data.map(item => {
                    return (
                        <div key={item._id}>
                            <div className="likes">
                            <span><img className="rounded-circle" style={{width:"40px",height:"40px"}} src={item.postBy.photo!=="no image"?item.postBy.photo:profilePic} alt="profile_pic" />
                            &nbsp; &nbsp;  <Link style={{textDecoration:"none",color:"black"}} to={item.postBy._id!==user._id?"/profile/"+item.postBy._id:"/Profile"}>{item.postBy.name}</Link></span>
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
                                
                                <Link to={'/comments/'+item._id}>Show Comments</Link> 
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
export default Home;