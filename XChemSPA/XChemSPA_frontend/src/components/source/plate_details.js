import React, { Component } from 'react';

export class PlateDetails extends Component {
	
		
    render() {
		
		const rows = this.props.compounds.map(compound => {
			return (
			<tr key={compound.code} className={compound.used ? "used-compound" : "unused-compound"}>
				<td>{compound.well}</td>
				<td>{compound.code}</td>
				<td>{compound.smiles}</td>
				<td>{compound.used ? "Used" : "Unused"}</td>
			</tr>
			
			);
			
			});
		
		return(
			<table className="table batch-details">
				<thead>
					<tr>
						<th>Source Well</th>
						<th>Code</th>
						<th>Smiles</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					{rows}
				</tbody>
			</table>
		);
	}
}

export default PlateDetails;
