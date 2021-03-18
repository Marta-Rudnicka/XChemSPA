import React from 'react';
import Plate from './crystallisation_plate.js';

class Main extends React.Component {
	
	render() {
		 let output = [];
		 this.props.plates.forEach(plate => {
			output.push( <Plate 
			crystals={plate.crystalArray} 
			dropvol={plate.dropVolume} 
			name={plate.name} 
			key={plate.name} 
			handleAccept={this.props.handleAccept} 
			handleReject={this.props.handleReject}
			/>
			);
		});
		
		return (
			<div id="">
				{output}
			</div>
		);
	}
}

export default Main;
