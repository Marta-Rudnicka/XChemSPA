import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';

import Header from './layout/Header';
import Source from './source/Source.js';
import Home from './home/Home.js';
import Crystals from './crystals/Crystals.js';
import Batches from './batches/Batches.js';
import Soak from './soak/Soak.js';
import Cryo from './cryo/Cryo.js';


import {
  BrowserRouter as Router,
  Switch,
  Route,
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
						<Header active={this.state.active} />
						
						<Switch>	 
						  <Route path="/source">
							<Source switchActive={this.switchActive}/>
						  </Route>
						  <Route path="/crystals">
							<Crystals switchActive={this.switchActive}/>
						  </Route>
						  <Route path="/batches">
							<Batches switchActive={this.switchActive}/>
						  </Route>
						  <Route path="/soak">
							<Soak switchActive={this.switchActive}/>
						  </Route>
						  <Route path="/cryo">
							<Cryo switchActive={this.switchActive}/>
						  </Route>
						   <Route path="/">
							<Home switchActive={this.switchActive}/>
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
