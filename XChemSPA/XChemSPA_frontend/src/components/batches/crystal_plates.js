import React, { Component } from 'react';

import CrystalPlateModel from './crystal_plate_model.js';

export class CrystalPlates extends Component {
	constructor(props){
		super(props)
		this.closePlateModel = this.closePlateModel.bind(this);
		this.openPlateModel = this.openPlateModel.bind(this);
		this.state = {
			editedPlate: null
		}
	
	}
	
	closePlateModel(){
		this.setState({editedPlate: null});
		console.log('fired closePlateModel')
	}
	
	openPlateModel(plate){
		this.setState({editedPlate: plate});
		console.log('fired openPlateModel on ', plate);
	}
	
	
    render() {
		let crystalsTotal = 0;
		const rows = this.props.crystals.map(plate=>{
			crystalsTotal = crystalsTotal + plate.items;
			return (
				<tr key={plate.id} className="crystal-row">
					<td>{plate.id}</td>
					<td>{plate.items}</td>
					<td className="alloted">
						<span className="alloted-number">[TODO]</span>
					</td>
					<td className="edit">
						<button className="edit-allotment" onClick={() => this.	openPlateModel(plate)}>Edit</button>
					</td>
				</tr>
			)
		});
		
		const models = this.props.crystals.map(plate=>{
			let display;
			if(plate === this.state.editedPlate) {
				display = "";
			}
			else{
				display="hidden";
			}
			
			return (<CrystalPlateModel key={plate.id} plate={plate} closePlateModel={this.closePlateModel} display={display} />);
			
		});
		
        return (
        <>
			  <table className="table">
				<caption>Crystallisation plates</caption>
				<thead>
					<tr>
						<th>Plate ID</th>
						<th>Usable <br/>crystals</th>
						<th>Alloted for experiment</th>
						<th>Edit allotment</th>
					</tr>
				</thead>
				<tbody>		
				{rows}
				</tbody>
				<tfoot>
					<tr>
						<td><strong>Total:</strong></td>
						<td id="total-crystals">{crystalsTotal}</td>
						<td id="total-unused-crystals" className="unused-crystals"></td>
					</tr>
				</tfoot>
			</table>
			<div id="plate-models">
				{models}
			</div>
			</>
        );
    }
}

export default CrystalPlates
