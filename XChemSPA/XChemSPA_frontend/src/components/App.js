import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';

import Header from './layout/Header';
import Source from './source/source.js';
import Home from './home/Home.js';
import Crystals from './crystals/Crystals.js';
import Batches from './batches/Batches.js';
import Dashboard from './reviews/Dashboard';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import { Provider } from 'react-redux';
import store from '../store';

class App extends Component {
	constructor(props){
		super(props);
		this.switchActive = this.switchActive.bind(this);
		this.state = { active: "home"}
	}
	
	switchActive(string){
		this.setState({ active: string});
	}
	
	
    render() {
        return (
            <Provider store={store}>
                <Fragment>
					<Router>
						<Header active={this.state.active} switchActive={this.switchActive} />
						<Switch>	 
						  <Route path="/source">
							<Source />
						  </Route>
						  <Route path="/crystals">
							<Crystals />
						  </Route>
						  <Route path="/batches">
							<Batches />
						  </Route>
						   <Route path="/">
							<Home />
						  </Route>
						</Switch>
					</Router>
                </Fragment>
            </Provider>

        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));

//<Source proposal="placeholder_value"/>
