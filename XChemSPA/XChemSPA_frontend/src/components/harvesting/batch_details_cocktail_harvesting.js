import React from 'react';
import { timestampMixin } from '../reusable_components/timestamp_mixin';
import  BatchDetailsCocktail from '../batches/old-batches/batch_details_cocktail.js';

export class BatchDetailsCocktailHarvesting extends timestampMixin(BatchDetailsCocktail) {
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

    headers(){
        const main = this.getMainHeaders();
		const extra = this.getExtraHeaders();
		return (
			<React.Fragment>
                {extra}
				{main}
			</React.Fragment>
		);
    }

	getCombinationRows(crystal){
        const height = crystal.compound_combination.compounds.length;
        let counter = 0;

        const rows = crystal.compound_combination.compounds.map((item, index) => {
            counter ++;
			return (
				<tr key={index}>
                    <td>{item.well}</td>
                    <td>{item.code}</td>
                    <td>{item.smiles}</td>
                    <td>{item.related_crystal}</td>
                    <td>{counter}</td>
                    {this.getCrystalCells(crystal, counter, height)}
				</tr>
			)
		})
		return rows;
	}

    getCrystalCells(crystal, counter, height){
        if (counter===1){
            return (
                <React.Fragment>
                    <td rowSpan ={height}>{crystal.crystal_name.well}</td>
                    <td rowSpan ={height}>{crystal.crystal_name.crystal_name}</td>
                    <td rowSpan ={height}>{crystal.batch.solv_frac}</td>
                    <td rowSpan ={height}>{crystal.batch.soak_vol}</td>
                    <td rowSpan ={height}>{crystal.batch.cryo_transfer_vol}</td>
					<td rowSpan ={height}>{crystal.crystal_name.crystal_name}</td>
					<td rowSpan ={height}>{crystal.puck}</td>
					<td rowSpan ={height}>{crystal.position}</td>
					<td rowSpan ={height}>{crystal.pin_barcode}</td>
					<td rowSpan ={height}>{crystal.mounting_result}</td>
					<td rowSpan ={height}>{crystal.printDate(item.arrival_time)}</td>
					<td rowSpan ={height}>{crystal.printDate(item.mounted_timestamp)}</td>
					<td rowSpan ={height}>{crystal.formatTimeDelta(item.mounting_time)}</td>
                </React.Fragment>
            
                );
        }
        else{
            return null;
        }
    }
}

export default BatchDetailsCocktailHarvesting;