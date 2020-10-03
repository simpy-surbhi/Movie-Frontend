import React from 'react';
import logo from './logo.svg';
import './App.css';
import SignUP from "./Views/SignUP.js";
import SignIn from "./Views/SignIn.js";
import Login from "./Views/Login.js";
import SearchMovie from "./Views/SearchMovie.js"
import { Link, BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Views/Home';
import DetailsMovie from './Views/DetailsMovie.js'


function App() {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUP} />
          <Route path="/home" component={Home} />
          <Route path="/signin" component={SignIn} />
          <Route path="/search/:name" component={SearchMovie} />
          <Route path="/details/:idMovie" component={DetailsMovie} />
        </Switch>
      </Router>
    </React.Fragment>
  );
}

export default App;
