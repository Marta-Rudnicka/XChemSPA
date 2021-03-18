import React, { Component } from 'react';

export class SelectCrystalPlate extends Component {
	
	render(){
		const options = this.props.crystals.map(plate => {
			return <option key={plate.id} value={plate.id}>{plate.name}</option>;
		
		});
		
        return (
				<select className="cr-plate-selection" onChange={() => console.log('x')}>
					<option value="null">None / reset selection</option>
					{options}
				</select>
        );
    }
}

export default SelectCrystalPlate;
