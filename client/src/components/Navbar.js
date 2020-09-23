import React from 'react';
import {Link} from 'react-router-dom';

const Navbar = () => {
    let linkHome="/";
    let linkProfile="/profile";
    let linkSearch="/search";
    let linkCreatePost="/post"
    let linkNotification="/notification";
    const renderList =()=>{
        const user =JSON.parse(localStorage.getItem("user"));
        if(user){
            return(
                <>
                    <li><Link to={linkHome}><i className="fas fa-home" aria-hidden="true"></i></Link></li>
                    <li><Link to={linkSearch}><i className="fas fa-search" aria-hidden="true"></i></Link></li>
                    <li><Link to={linkCreatePost}><i className="fas fa-plus-square"  aria-hidden="true"></i></Link></li>
                    <li><Link to={linkNotification}><i className="fas fa-bell" aria-hidden="true"></i></Link></li>
                    <li><Link to={linkProfile}><i className="fas fa-user" aria-hidden="true"></i></Link></li>
                </>
            )
        }
        else{
            return(
                <>
                </>
            )
        }
    }
    return (
        <>
            <nav className="navbar navbar-light bg-light fixed-top">
                <div className="navbar-brand">
                <Link className="home" to="/">
                    SocialVerse
                    </Link>
                </div>
                <div>
                    <ul className="nav">
                        {renderList()}
                    </ul>
                </div>
            </nav>
            <nav className="navbar navbar-light bg-light fixed-bottom bottom justify-content-center">
                <div>
                    <ul>
                        {renderList()}
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default Navbar;

