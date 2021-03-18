import React, { Component } from 'react';

export class Header extends Component {
    render() {
        return (
            <nav>
			
					<ul className="nav shadow">
						 <li className="nav-item"><a className="navbar-brand" href="#">WebSoakDB Home |</a></li>
						 <li className="nav-item"><a className="navbar-brand" href="#">Look up solvent notes|</a></li>
						 <li className="nav-item"><a className="navbar-brand" href="#">DETAILED VIEW (experimental data for individual crystals) |</a></li>
					
					</ul>
                    <ul  className="nav nav-tabs">
                        <li className="nav-item"><a className="nav-link" href="#">Compound screen home </a></li>
                        <li className="nav-item"><a className="nav-link active" href="#">Compounds </a></li>
                        <li className="nav-item"><a className="nav-link" href="#">Crystals </a></li>
                        <li className="nav-item"><a className="nav-link" href="#">Batches </a></li>
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

// <nav className="navbar navbar-expand-sm navbar-light bg-light">
//   <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
