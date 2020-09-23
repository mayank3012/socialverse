import React, { useState, useLayoutEffect } from 'react'
import { useParams } from 'react-router-dom'
import M from 'materialize-css'
import profilePic from '../images/avtar.png'

export default function Comments() {
    const [data, setData] = useState(null)
    const { id } = useParams();
    const user =JSON.parse( localStorage.getItem("user"));
    useLayoutEffect(() => {
        fetchData()
    },[])
    const fetchData=()=>{
        fetch('/viewComments/' + id, {
            headers: {
                "Authorization": "Bearer" + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                if (result.error) {
                    M.toast({ html: result.error, classes: "#c62828 red darken-3" });
                }
                else {
                    setData(result.results)
                }
            }).catch(e => {
                console.log(e);
                M.toast({ html: e, classes: "#c62828 red darken-3" });
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
                fetchData()
        }).catch(e=>{
            console.log(e);
        })
    }
    const delComment=(text,postedById,postId)=>{
        fetch("/delComment",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer"+localStorage.getItem("jwt")
            },body:JSON.stringify({
                postId,
                text,
                postedById
            })
        }).then(res=>res.json())
        .then(result=>{
            fetchData()
        }).catch(e=>{
            console.log(e);
        })
    }
    return (
        <>
        {!user?<h2 className="loading">Loading...</h2>:
            <div className="comments">
                {data===null||data[0].comments.length<1?<h2>NO Comments</h2>:
                    data[0].comments.map(item => {
                        return (
                        <div key={item._id} style={{margin:"10px"}}><img className="rounded-circle" style={{width:"40px",height:"40px"}} src={item.postedBy.photo!=="no image"?item.postedBy.photo:profilePic} alt="profile_pic" />
                        &nbsp; &nbsp;<h5 style={{display:"inline"}}>{item.text}</h5>
                        <span style={{float:"right"}}>
                               {
                                   item.postedBy._id===user._id||data[0].postBy._id===user._id
                                    ?
                                        <i className="fa fa-trash" onClick={()=>{delComment(item.text,item.postedBy._id,id)}} style={{color:"red"}} aria-hidden="true"></i>
                                    :
                                ""
                               }
                               </span></div>)
                    })}
                     <form style={{position:"absolute",width:"80%",bottom:"20px"}} onSubmit={(e)=>
                                    {
                                    e.preventDefault();
                                    comment(e.target[0].value,id)
                                    e.target[0].value=""
                                    }
                                }>
                                    
                                <input type="text" placeholder="Leave a comment" />
                                </form>
            </div>
        }</>
    )
}
