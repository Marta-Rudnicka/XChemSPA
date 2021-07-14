import React from 'react';
import BatchDetails from '../batches/old-batches/batch_details';
import { timestampMixin } from '../reusable_components/timestamp_mixin';

export class BatchDetailsHarvesting extends timestampMixin(BatchDetails) {
	constructor(props){
		super(props)
		this.state = {
			editedPlate: null
		}
	}

    getExtraHeaders(){
        return (
            <React.Fragment>
                <th>Solvent conc. (%)</th>
                <th>Soak transfer volume</th>
                <th>Cryo transfer volume</th>
				<th>Crystal name</th>
				<th>Puck</th>					
				<th>Position</th>
				<th>Pin Barcode</th>
				<th>Mounting Result</th>
				<th>Arrival Time</th>
				<th>Mounted Timestamp</th>
				<th>Mounting Time (m:s)</th>
            </React.Fragment>
        );
    }

	getCrystalRows(){
		const rows = this.props.crystals.map((item, index) => {
			return (
				<tr key={index}>
					<td>{item.crystal_name.well}</td>
					<td>{item.single_compound.well}</td>
					<td>{item.single_compound.code}</td>
					<td>{item.single_compound.smiles}</td>
                    <td>{item.batch.solv_frac}</td>
                    <td>{item.batch.soak_vol}</td>
                    <td>{item.batch.cryo_transfer_vol}</td>
					<td>{item.crystal_name.crystal_name}</td>
					<td>{item.puck}</td>
					<td>{item.position}</td>
					<td>{item.pin_barcode}</td>
					<td>{item.mounting_result}</td>
					<td>{this.printDate(item.arrival_time)}</td>
					<td>{this.printDate(item.mounted_timestamp)}</td>
					<td>{this.formatTimeDelta(item.mounting_time)}</td>
				</tr>
			)
		})
		return rows;
	}
}

export default BatchDetailsHarvesting;