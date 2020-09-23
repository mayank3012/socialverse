import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Createpost from './components/Createpost';
import Profile from './components/Profile';
import EditUser from './components/EditUser';
import Comments from'./components/Comments';
import UsersProfile from './components/UsersProfile';



const Routing = () => {
  return(
  <Switch>
    <Route exact path="/">
    <Navbar />
      <Home />
    </Route>
    <Route path="/signin">
    <Navbar />
      <Signin />
    </Route>
    <Route path="/signup">
      <Signup />
    </Route>
    <Route path="/post">
      <Createpost />
    </Route>
    <Route exact path="/profile">
      <Navbar/>
      <Profile />
    </Route>
    <Route path="/edituser">
      <EditUser />
    </Route>
    
    <Route path="/comments/:id">
      <Comments />
    </Route>
    
    <Route path="/profile/:id">
      <UsersProfile />
    </Route>
  </Switch>
  )
}

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routing/>
    </BrowserRouter>
  );
}

export default App;
