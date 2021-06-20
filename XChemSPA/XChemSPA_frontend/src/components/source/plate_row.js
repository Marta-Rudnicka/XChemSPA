import React from 'react';
import {Show, Hide} from '../Icons.js';
//import {batches} from '../batches/fake_data.js';
import ExistingBatchRow from '../batches/old-batches/existing_batch_row.js';
import PlateDetails from './plate_details.js';
//import BatchDetailsBySoak from '../batches/batch_details_by_soak.js';

export class PlateRow extends ExistingBatchRow {
		
    render() {
		const plate = this.props.plate;			
        return (
				<React.Fragment>
					<tr>
						<td>{plate.library_name}</td>
						<td>{plate.library_plate}</td>
						<td>{plate.compounds.length}</td>
						<td>{plate.used}</td>
						<td>{plate.unused}</td>
						<td>
							<Show handleClick={this.showDetails} className={this.state.showClass}/>
							<Hide Show handleClick={this.hideDetails} className={this.state.hideClass} />
						</td>
					</tr>
					<tr>
						<td colSpan="6" className={this.state.detailClass}>
							<div className={this.state.detailClass}>
							   <PlateDetails compounds={plate.compounds} />
							</div>
						</td>
					</tr>
				</React.Fragment>
        );
    }
}

export default PlateRow;