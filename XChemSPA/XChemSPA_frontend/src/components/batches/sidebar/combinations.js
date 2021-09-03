import React, { Component } from 'react';

export class Combinations extends Component {
	

	groupCombinationsByPlates(combinations){
		let plates = [];

		combinations.forEach(comb => {
			comb.compounds.forEach( c => {
				const plate = this.getPlate(plates, c.library_name, c.library_plate)
				if (comb.status === "used"){
					plate.used ++;
				}
				else {
					plate.unused ++;
				}
			});
		});
		return plates
	}

	getPlate(array, library_name, plate_name){
		//find the right plate in the array, or create a new one if it doesn't exist
		let found = array.find(plate => plate.library_name === library_name && plate.plate_name === plate_name);
		if (found === undefined){
			found = {
				library_name : library_name,
				plate_name : plate_name,
				unused : 0,
				used : 0
			}
			array.push(found);
		}
		return found;
	}
	
    render() {
		let compoundsTotal = 0;
		console.log('this.props.combinations', this.props.combinations)
		const rows = this.groupCombinationsByPlates(this.props.combinations).map((plate, index) =>{
			
			return (
				<tr key={index}>
					<td>{plate.library_name}</td>
					<td>{plate.plate_name}</td>
					<td>{plate.unused + plate.used}</td>
					<td>{plate.unused}</td>
					<td>{plate.used}</td>
				</tr>
			)
		});
		
        return (
           <table className="table">
				<caption>Combinations of compounds</caption>
				<thead>
					<tr>
						<th>Library</th>
						<th>Plate</th>
						<th>Compounds in <br/> combinations</th>
						<th>Unused</th>
						<th className="unused-compounds">Used</th>
					</tr>
				</thead>
				<tbody>
					{rows}
				</tbody>
			</table>
        );
    }
}

export default Combinations;
