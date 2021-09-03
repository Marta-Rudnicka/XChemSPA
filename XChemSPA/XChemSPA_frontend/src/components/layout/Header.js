import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";

export class Header extends Component {
	
    render() {
		
		let classes = {
			home : 'nav-link',
			source : 'nav-link',
			crystals : 'nav-link',
			batches : 'nav-link',
			soak : 'nav-link',
			cryo : 'nav-link',
			harvesting : 'nav-link',
			visit : 'nav-link'
		}

		classes[this.props.active] = "nav-link active"
					
        return (
			<div id="header">
				<nav>	
						<ul className="nav shadow">
							<li className="nav-item"><a className="navbar-brand" href="#">XChemSPA Home |</a></li>
							<li className="nav-item"><a className="navbar-brand" href="#">Look up solvent notes|</a></li>
							<li className="nav-item"><a className="navbar-brand" href="#">DETAILED VIEW (experimental data for individual crystals) |</a></li>
						
						</ul>
						<ul className="nav nav-tabs">
							<li className="nav-item"><Link to="/" className={classes.home}>Compound screen home </Link></li>
							<li className="nav-item"><Link to="/source/" className={classes.source}>Source compounds </Link></li>
							<li className="nav-item"><Link to="/crystals/" className={classes.crystals}>Crystals </Link></li>
							<li className="nav-item"><Link to="/batches/" className={classes.batches}>Batches </Link></li>
							<li className="nav-item"><Link to='/soak/' className={classes.soak}>Soaking </Link></li>
							<li className="nav-item"><Link to='/cryo/' className={classes.cryo}>Cryo </Link></li>
							<li className="nav-item"><Link to='/harvesting/' className={classes.harvesting}>Harvesting </Link></li>   
							<li className="nav-item"><a className="nav-link" href="#">Data Collection </a></li>
							<li className="nav-item"><Link to='/visit/' className={classes.visit}>ChangeVisit </Link></li>   
						</ul>
				</nav>
				<div className="header-visit shadow">
					<h2>{this.props.visit ? 'Visit:' : "" }</h2>
					<p>{this.props.visit}</p>
				</div>
			</div>
        );
    }
}

export default Header
