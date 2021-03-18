import React, { Component } from 'react';

export class SelectLibraryPlate extends Component {
    render() {
		const options = this.props.libraries.map(plate => {
			return <option key={plate.id} value={plate.id}>{plate.library}: {plate.plate}</option>;
		
		});
        return (
				<select className="lib-plate-selection" onChange={() => console.log('y')}>
					<option value="null">None / reset selection</option>
					{options}
				</select>
        );
    }
}

export default SelectLibraryPlate
