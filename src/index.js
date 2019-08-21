import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Routers from './Routers';
import "./style_index.css"

ReactDOM.render(
    <BrowserRouter>
        <Routers />
    </BrowserRouter>, 
document.getElementById('page'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
