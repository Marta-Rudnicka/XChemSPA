import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';

import Header from './layout/Header';
import Source from './source/Source.js';
import Home from './home/Home.js';
import Crystals from './crystals/Crystals.js';
import Batches from './batches/Batches.js';
import Soak from './soak/Soak.js';
import Cryo from './cryo/Cryo.js';
import Visit from './visit/Visit.js';


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import { Provider } from 'react-redux';
import store from '../store';

class App extends Component {
	constructor(props){
		super(props);
		this.switchActive = this.switchActive.bind(this);
		this.setVisit = this.setVisit.bind(this);
		this.setProposal = this.setProposal.bind(this);
		this.state = { 
			active: "home", 
			visit: null,
			proposal: null
		}
	}
	
	switchActive(string){
		this.setState({ active: string});
	}
	
	setVisit(string){
		this.setState({visit: string});
	}

	setProposal(string){
		this.setState({proposal: string});
	}
	
    render() {
        return (
            <Provider store={store}>
                <Fragment>
					<Router>
						<Header active={this.state.active} visit={this.state.visit} />
						
						<Switch>	 
						  <Route path="/source/">
						  	{this.state.visit ? 
						  	<Source switchActive={this.switchActive} 
							  proposal={this.state.proposal}
							  visit={this.state.visit}
							  /> : 
							  <Redirect to="/visit/" /> }
						  </Route>
						  <Route path="/crystals/">
						  	{this.state.visit ? 
						  	<Crystals switchActive={this.switchActive} 
							visit={this.state.visit} 
							proposal={this.state.proposal}/> : 
							<Redirect to="/visit/" /> }
						  </Route>
						  <Route path="/batches/">
							{this.state.visit ? 
							<Batches switchActive={this.switchActive}
							proposal={this.state.proposal}
							/> : 
							<Redirect to="/visit/" /> }
						  </Route>
						  <Route path="/soak/">
							{this.state.visit ? <Soak switchActive={this.switchActive}/> : <Redirect to="/visit/" /> }
						  </Route>
						  <Route path="/cryo/">
							{this.state.visit ? <Cryo switchActive={this.switchActive}/> : <Redirect to="/visit/" /> }
						  </Route>
						  <Route path="/visit/">
							<Visit switchActive={this.switchActive} setVisit={this.setVisit} setProposal={this.setProposal}/>
						  </Route>
						   <Route path="/">
						   {this.state.visit ? <Home switchActive={this.switchActive}/> : <Redirect to="/visit/" /> }
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
