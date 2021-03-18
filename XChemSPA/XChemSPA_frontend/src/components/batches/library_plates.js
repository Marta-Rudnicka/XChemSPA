import React, { Component } from 'react';

export class LibraryPlates extends Component {
    render() {
		let compoundsTotal = 0;
		const rows = this.props.libraries.map(plate=>{
			compoundsTotal = compoundsTotal + plate.items;
			return (
				<tr key={plate.id}>
					<td>{plate.library}</td>
					<td>{plate.plate}</td>
					<td>{plate.items}</td>
					<td>TODO</td>
				</tr>
			)
		});
		
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
						<td id="total-compounds">{compoundsTotal}</td>
					</tr>
				</tfoot>
			</table>
        );
    }
}

export default LibraryPlates;
