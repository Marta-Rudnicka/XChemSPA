import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export class Header extends Component {
	
    render() {
		let home='nav-link';
		let source='nav-link';
		let crystals='nav-link';
		let batches='nav-link';
		let soak='nav-link';
		let cryo='nav-link';
		let harvesting='nav-link';
		let visit='nav-link';
		
		switch(this.props.active){
			case "home":
				home = "nav-link active"
				break;
			case "source":
				source = "nav-link active"
				break;
			case "crystals":
				crystals = "nav-link active"
				break;
			case "batches":
				batches = "nav-link active"
				break;		
			case "soak":
				soak = "nav-link active"
				break;		
			case "cryo":
				cryo = "nav-link active"
				break;
			case "harvesting":
				cryo = "nav-link active"
				break;
			case "visit":
				visit = "nav-link active"
				break;		
		}
			
        return (
			<div id="header">
				<nav>	
						<ul className="nav shadow">
							<li className="nav-item"><a className="navbar-brand" href="#">XChemSPA Home |</a></li>
							<li className="nav-item"><a className="navbar-brand" href="#">Look up solvent notes|</a></li>
							<li className="nav-item"><a className="navbar-brand" href="#">DETAILED VIEW (experimental data for individual crystals) |</a></li>
						
						</ul>
						<ul className="nav nav-tabs">
							<li className="nav-item"><Link to="/" className={home}>Compound screen home </Link></li>
							<li className="nav-item"><Link to="/source/" className={source}>Source compounds </Link></li>
							<li className="nav-item"><Link to="/crystals/" className={crystals}>Crystals </Link></li>
							<li className="nav-item"><Link to="/batches/" className={batches}>Batches </Link></li>
							<li className="nav-item"><Link to='/soak/' className={soak}>Soaking </Link></li>
							<li className="nav-item"><Link to='/cryo/' className={cryo}>Cryo </Link></li>
							<li className="nav-item"><Link to='/harvesting/' className={harvesting}>Harvesting </Link></li>   
							<li className="nav-item"><a className="nav-link" href="#">Data Collection </a></li>
							<li className="nav-item"><Link to='/visit/' className={visit}>ChangeVisit </Link></li>   
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
