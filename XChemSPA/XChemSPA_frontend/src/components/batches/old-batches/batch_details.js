import React, { Component } from 'react';

export class BatchDetails extends Component {
	constructor(props){
		super(props)
		this.state = {
			editedPlate: null
		}
	}
	
	getExtraHeaders(){
        return null; //overwritten in BatchDetailsCocktail
    }

	getCrystalRows(){
		const rows = this.props.crystals.map((item, index) => {
			return (
				<tr key={index}>
					<td>{item.crystal_name.well}</td>
					<td>{item.single_compound.well}</td>
					<td>{item.single_compound.code}</td>
					<td>{item.single_compound.smiles}</td>
				</tr>
			)
		})
		return rows;
	}

    render() {
		
		let crystal_rows = null;
		if (this.props.crystals){
			crystal_rows = this.getCrystalRows();
		}

		const extraHeaders = this.getExtraHeaders();

		return(
			<table className="batch-details">
				<thead>
					<tr>
						<th>Drop</th>
						<th>Source Well</th>
						<th>Code</th>
						<th>Smiles</th>
						{extraHeaders}
					</tr>
				</thead>
				<tbody>
					{crystal_rows}
				</tbody>
			</table>
		);
	}
}

export default BatchDetails;
