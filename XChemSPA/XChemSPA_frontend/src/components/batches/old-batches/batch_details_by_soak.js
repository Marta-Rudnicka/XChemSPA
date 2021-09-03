import React, { Component } from 'react';

export class BatchDetailsBySoak extends Component {
	constructor(props){
		super(props)
		this.state = {
			editedPlate: null
		}
	
	}
	
	countSoaks(){
		let soaks = 0;
	
		this.props.crystals.forEach(crystal =>{
			if (crystal.compound_combination.compounds.length > soaks){
				soaks = crystal.compound_combination.compounds.length;
			}
		});
		return soaks;
	}
	
	makeCompoundRow(compound, crystal, key){
		return (
			<tr key={key}>
				<td>{crystal.crystal_name.well}</td>
				<td>{compound.well}</td>
				<td>{compound.code}</td>
				<td>{compound.smiles}</td>
				<td>{compound.related_crystal}</td>
			</tr>
		);
	}
	
	makeSoakTable(crystals, index){
		const header = <tr className="soakHeader"><td colSpan="5"><h4>Soak {index + 1}</h4></td></tr>
		
		const body = crystals.map((crystal, index) => {
			return this.makeCompoundRow(crystal.compound_combination.compounds[index], crystal, index);
		});
		
		return (<React.Fragment>
					{header}
					{body}
				</React.Fragment>);
	}
	
	makeContent(crystals, soakCount){
		let tables = [];
		
		for (let i = 0; i < soakCount; i++){
			tables.push(this.makeSoakTable(crystals, i));
		}
		return tables;
	}
	
	
    render() {
		
		const subtables = this.makeContent(this.props.crystals, this.countSoaks(this.props.batch));
					
		return(
			<table className="batch-details">
				<thead>
					<tr>
						<th>Drop</th>
						<th>Source Well</th>
						<th>Code</th>
						<th>Smiles</th>
						<th>Related Crystal</th>
					</tr>
				</thead>
				<tbody>
					{subtables}
				</tbody>
			</table>
		);
	}
}

export default BatchDetailsBySoak;
