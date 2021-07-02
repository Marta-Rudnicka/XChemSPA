import React, { Component } from 'react';

export class LibraryPlates extends Component {

    render() {
		let compoundsTotal = 0;
		let unusedTotal = 0;
		let combinedTotal = 0;
		let combinationsFound = false;
		if (this.props.combinations && this.props.combinations.length > 0){
			combinationsFound = true;
		}
		let rows = <tr><td colSpan="4">Loading...</td></tr>;
		if (this.props.libraryPlates){
			rows = this.props.libraryPlates.map((plate, index)=>{
				

				const combined = plate.items.filter(item => item.status === "combined").length;
				const unused = plate.items.filter(item => item.status === "unused").length;
				compoundsTotal = compoundsTotal + plate.selected;
				unusedTotal = unusedTotal + unused;
				combinedTotal = combinedTotal + combined;
				if (plate.id === 99){
					return (
						<tr key={index}>
							<td colSpan="2">Compound combinations</td>
							<td colSpan="2">{plate.selected}</td>
							<td>{unused}</td>
						</tr>
					);
				}
				else{
					return (
						<tr key={index}>
							<td>{plate.library_name}</td>
							<td>{plate.name}</td>
							<td>{plate.selected}</td>
							{ combinationsFound ? <td>{combined}</td> : null}
							<td>{unused}</td> 
							
						</tr>
					
					);	
				}
			});
		}

        return (
           <table className="table">
				<caption>Library plates</caption>
				<thead>
					<tr>
						<th>Library</th>
						<th>Plate</th>
						<th>Selected <br />compounds</th>
						{ combinationsFound ? <th>In combinations</th> : null }
						<th className="unused-compounds">Unused { combinationsFound ? "single" : null} compounds</th>
						
					</tr>
				</thead>
				<tbody>
					{rows}
				</tbody>
				<tfoot>
					<tr>
						<td colSpan="2"><strong>Total:</strong></td>
						<td>{compoundsTotal}</td>
						{ combinationsFound ? <td>{combinedTotal}</td> : null }
						<td>{unusedTotal}</td>
					</tr>
				</tfoot>
			</table>
        );
    }
}

export default LibraryPlates;
