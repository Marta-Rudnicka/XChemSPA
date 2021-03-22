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
		}
			
        return (
            <nav>	
					<ul className="nav shadow">
						 <li className="nav-item"><a className="navbar-brand" href="#">XChemSPA Home |</a></li>
						 <li className="nav-item"><a className="navbar-brand" href="#">Look up solvent notes|</a></li>
						 <li className="nav-item"><a className="navbar-brand" href="#">DETAILED VIEW (experimental data for individual crystals) |</a></li>
					
					</ul>
                    <ul className="nav nav-tabs">
                        <li className="nav-item"><Link to="/" className={home} onClick={event => this.props.switchActive("home")}>Compound screen home </Link></li>
                        <li className="nav-item"><Link to="/source" className={source} onClick={event => this.props.switchActive("source")}>Source compounds </Link></li>
                        <li className="nav-item"><Link to="/crystals" className={crystals} onClick={event => this.props.switchActive("crystals")}>Crystals </Link></li>
                        <li className="nav-item"><Link to="/batches" className={batches} onClick={event => this.props.switchActive("batches")}>Batches </Link></li>
                        <li className="nav-item"><a className="nav-link" href="#">Soaking </a></li>
                        <li className="nav-item"><a className="nav-link" href="#">Cryo </a></li>
                        <li className="nav-item"><a className="nav-link" href="#">Harvesting </a></li>   
                        <li className="nav-item"><a className="nav-link" href="#">Data Collection </a></li>   
                     </ul>
            </nav>
        );
    }
}

export default Header
