import React, { Component } from 'react';

export class LibraryPlates extends Component {

    render() {
		let compoundsTotal = 0;
		let unusedTotal = 0;
		let rows = <tr><td colSpan="4">Loading...</td></tr>;
		if (this.props.libraryPlates){
			rows = this.props.libraryPlates.map((plate, index)=>{
			compoundsTotal = compoundsTotal + plate.items.length;
			unusedTotal = unusedTotal + plate.size;
			
				return (
					<tr key={index}>
						<td>{plate.library_name}</td>
						<td>{plate.name}</td>
						<td>{plate.selected}</td>
						<td>{plate.size}</td>
					</tr>
				)
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
						<th className="unused-compounds">Unused</th>
					</tr>
				</thead>
				<tbody>
					{rows}
				</tbody>
				<tfoot>
					<tr>
						<td colSpan="2"><strong>Total:</strong></td>
						<td>{compoundsTotal}</td>
						<td>{unusedTotal}</td>
					</tr>
				</tfoot>
			</table>
        );
    }
}

export default LibraryPlates;
