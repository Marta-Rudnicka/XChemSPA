import React, { Component } from 'react';
import {Show, Hide} from '../Icons.js';
import {batches} from './fake_data.js';

export class BatchDetailsBySoak extends Component {
	constructor(props){
		super(props)
		this.state = {
			editedPlate: null
		}
	
	}
	
	countSoaks(batch){
		let soaks = 0;
	
		batch.crystals.forEach(crystal =>{
			if (crystal.compounds.length > soaks){
				soaks = crystal.compounds.length;
			}
		});
		console.log('soaks: ', soaks);
		return soaks;
	}
	
	makeCompoundRow(compound, crystal){
		return (
			<tr key={compound.code}>
				<td>{crystal.drop}</td>
				<td>{compound.source_well}</td>
				<td>{compound.code}</td>
				<td>{compound.smiles}</td>
				<td>{compound.related_crystal}</td>
				
			</tr>
		);
	}
	
	makeSoakTable(batch, index){
		const header = <tr className="soakHeader"><td colSpan="5"><h4>Soak {index + 1}</h4></td></tr>
		
		const body = batch.crystals.map(crystal => {
			return this.makeCompoundRow(crystal.compounds[index], crystal);
		});
		
		return (<React.Fragment>
					{header}
					{body}
				</React.Fragment>);
	}
	
	makeContent(batch, soakCount){
		let tables = [];
		
		for (let i = 0; i < soakCount; i++){
			tables.push(this.makeSoakTable(batch, i));
		}
		return tables;
	}
	
	
    render() {
		
		const subtables = this.makeContent(this.props.batch, this.countSoaks(this.props.batch));
					
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
