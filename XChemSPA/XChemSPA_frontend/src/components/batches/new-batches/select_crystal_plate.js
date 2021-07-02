import React, { Component } from 'react';

export class SelectCrystalPlate extends Component {
	getNameString(plate){
		return plate.name;
	}
	render(){
		let options = null;
		if (this.props.plates) {
			options = this.props.plates.map(plate => {
				try {
					return <option key={plate.id} value={plate.id}>{this.getNameString(plate)} ({plate.unmatchedItems}/{plate.size})</option>;
				}
				catch(e){
					console.error(e)
					return <option key="x">. . . </option>
				}
			});
		}
        return (
				<select 
					className="cr-plate-selection" 
					onChange={(e) => this.props.handleChange(e.target.value)}
					value={this.props.value}
				>
					<option value='none'>None / reset selection</option>
					{options}
				</select>
        );
    }
}

export default SelectCrystalPlate;