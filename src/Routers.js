import React, { Component } from 'react';
import { Switch, Route,  } from 'react-router-dom';
import PrivateRoute from './private';
import Login from './components/Login/Login'
import Home from './App';

function Routers() {
    return (
        <Switch>
            <Route exact path='/' component={Login} />
            <PrivateRoute path='/app/home' component={Home} />
        </Switch>
    );
}

export default Routers;