import React, { Component } from 'react';
import {Show, Hide} from '../Icons.js';
import {batches} from './fake_data.js';

export class BatchDetails extends Component {
	constructor(props){
		super(props)
		this.state = {
			editedPlate: null
		}
	
	}
	
	makeCompoundCells(well, code, smiles){
		return (
			<React.Fragment>
				<td>{well}</td>
				<td>{code}</td>
				<td>{smiles}</td>
			</React.Fragment>
		);
	}
	
	makeCompoundRow(crystal, item, type, counter){
		
		let crystalRowSpan;
		let relatedCrystalCell = null;
		let soakCell = null;
		
		if (type === "multi"){
			crystalRowSpan = crystal.compounds.length;
			relatedCrystalCell = <td>{item.related_crystal}</td>;
			soakCell = <td>{item.soak}</td>
		}
		else {
			crystalRowSpan = 1;
		}
		
		
		let crystalCell;
		let statusCell;
		if (counter === 0) {
			crystalCell = <td rowSpan={crystalRowSpan}>{crystal.drop}</td>;
			
		}
		
		const compoundCells = this.makeCompoundCells(item.source_well, item.code, item.smiles);
		return (<tr key={crystal.code}>
					{compoundCells}
					{relatedCrystalCell}
					{soakCell}
					{crystalCell}
				</tr>);
	}
	
	
    render() {
		
		let crystal_rows;
		
		if (this.props.type === "single"){
			crystal_rows = this.props.crystals.map(crystal => {
				const row = this.makeCompoundRow(crystal, crystal, "single", 0);
				return row;
				}
			);
		}
		else {
			crystal_rows = this.props.crystals.map(crystal => {
				const rows = crystal.compounds.map((compound, index) => {
					const row = this.makeCompoundRow(crystal, compound, "multi", index);
					return row;
				});
				return rows;
			});
		}
		
		let relatedCrystalHeader = null;
		let soakHeader = null;
		
		if (this.props.type==="multi"){
			relatedCrystalHeader = <th>Related crystal</th>
			soakHeader = <th>Soak</th>
		}
		
		return(
			<table className="batch-details">
				<thead>
					<tr>
						<th>Source Well</th>
						<th>Code</th>
						<th>Smiles</th>
						{relatedCrystalHeader}
						{soakHeader}
						<th>Drop</th>
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
