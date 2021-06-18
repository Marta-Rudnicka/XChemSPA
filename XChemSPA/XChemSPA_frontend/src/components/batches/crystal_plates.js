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
	}
	
	openPlateModel(plate){
		this.setState({editedPlate: plate});
	}
	
	
    render() {
		let crystalsTotal = 0;
		let allottedTotal = 0;
		let rows = <tr><td colSpan="4">Loading...</td></tr>;
		let models = null;

		if (this.props.crystalPlates){
			rows = this.props.crystalPlates.map((plate, index) =>{
				crystalsTotal = crystalsTotal + plate.originalSize;
				allottedTotal = allottedTotal + plate.size
				return (
					<tr key={index} className="crystal-row">
						<td>{plate.name}</td>
						<td>{plate.originalSize}</td>
						<td className="alloted">
							<span className="alloted-number">{plate.size}</span>
						</td>
						<td className="edit">
							<button className="edit-allotment" onClick={() => this.openPlateModel(plate)}>Edit</button>
						</td>
					</tr>
				)
			});

			models = this.props.crystalPlates.map(plate=>{
				let display;
				if(plate === this.state.editedPlate) {
					display = "crystal-plate-model";
				}
				else{
					display="hidden";
				}
				return (<CrystalPlateModel 
						key={plate.name} 
						plate={plate} 
						closePlateModel={this.closePlateModel} 
						display={display} 
						updateCrystalsStatus={this.props.updateCrystalsStatus}
						resizeAndRefresh={this.props.resizeAndRefresh}
						resetAll={this.props.resetAll}
						/>)
			});
		}
		
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
						<td>{crystalsTotal}</td>
						<td>{allottedTotal}</td>
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
