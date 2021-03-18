import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';

import Header from './layout/Header';
import Source from './source/source.js';
import Home from './home/Home.js';
import Crystals from './crystals/Crystals.js';
import Batches from './batches/Batches.js';
import Dashboard from './reviews/Dashboard';

import { Provider } from 'react-redux';
import store from '../store';

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Fragment>
                    <Header />
                    <div>
                       <Batches />
                    </div>
                </Fragment>
            </Provider>

        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));

//<Source proposal="placeholder_value"/>
