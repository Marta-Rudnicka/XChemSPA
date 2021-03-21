import React, { Component } from 'react';

export class Combinations extends Component {
    render() {
		let compoundsTotal = 0;
		const rows = this.props.combinations.map(plate=>{
			compoundsTotal = compoundsTotal + plate.items;
			return (
				<tr key={plate.id}>
					<td>{plate.library}</td>
					<td>{plate.plate}</td>
					<td>{plate.combinations}</td>
					<td>{plate.items}</td>
					<td>TODO</td>
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
						<th>Combi-<br/>nations</th>
						<th>Compounds</th>
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

export default Combinations;
