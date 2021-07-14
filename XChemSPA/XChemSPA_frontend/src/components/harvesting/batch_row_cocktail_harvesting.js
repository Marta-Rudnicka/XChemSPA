import React from 'react';
import {Show, Hide} from '../Icons.js';
import BatchRowSoak from '../soak/batch_row_soak.js';
import BatchDetailsHarvesting from './batch_details_harvesting.js';
import BatchRowHarvesting from './batch_row_harvesting.js';
import { CSRFToken } from '../reusable_components/csrf.js';
import { basicCocktailMixin } from '../reusable_components/basic_cocktail_mixin.js';
import BatchDetailsCocktailHarvesting from './batch_details_cocktail_harvesting.js';

export class BatchRowCocktailHarvesting extends basicCocktailMixin(BatchRowHarvesting) {

    /*
	constructor(props){
		super(props)
		this.showDetails = this.showDetails.bind(this);
		this.hideDetails = this.hideDetails.bind(this);
		this.state = {
			detailClass: "container-cell-hidden",
			showClass: "",
			hideClass: "hidden",
			detailsBySoak: false,
		}
	}
	
	makeBatchInfo(){
		const batch = this.props.batch;
		return (
			<React.Fragment>	
				<td className={this.props.extra}>{batch.crystal_plate.drop_volume}</td>
                <td className={this.props.extra}>{batch.soaking_time}</td>
                <td className={this.props.extra}>{this.printDate(batch.soak_timestamp)}</td>
                <td className={this.props.extra}>{this.printDate(batch.cryo_timestamp)}</td>
			</React.Fragment>
		);
	}
*/
    getBatchDetails(){
		return <BatchDetailsCocktailHarvesting crystals={this.props.batch.crystals} />
	}
/*
	shifterExchange(){
		if (this.props.batch.crystals[0].mounted_timestamp){
			return null;
		}
		else{
			return (
				<React.Fragment>
					<a href={"/exports/shifter-input/" + this.props.batch.id + '/'}>
						<button>Download file for Shifter</button>
					</a>
					<hr />
					<form action={"/imports/shifter-output/" + this.props.batch.id + '/'} method="post" encType="multipart/form-data">
						<CSRFToken />
						<label htmlFor="input_file">Upload file from Shifter</label><br/>
						<input type="file" name="input_file"></input>
						<button type="submit">Submit</button>
					</form>
				</React.Fragment>
			);
		}
	}

	barcodeReaderExchange(){
		if (this.props.batch.crystals[0].pin_barcode){
			return <p>Done</p>;
		}
		else{
			return (
				<form action={"/imports/barcode-reader/" + this.props.batch.id + '/'} method="post" encType="multipart/form-data">
					<CSRFToken />
					<label htmlFor="input_file">Upload barcode reader file</label><br/>
					<input type="file" name="input_file"></input>
					<button type="submit">Submit</button>
				</form>
			)
		}
	}

    render() {
		console.log('test');
		const batch = this.props.batch;
		const details = this.getBatchDetails();
		const batch_info = this.makeBatchInfo();
		const changeView = this.getChangeView();
		const shifterExchange = this.shifterExchange();
		const barcodeReaderExchange = this.barcodeReaderExchange();
        const actionButton = <a href={"/exports/shifter-input/" + this.props.batch.id + '/'}><button>Download Shifter <br /> input file</button></a>;
		
        return (
				<React.Fragment>
					<tr>
						<td>{batch.number}</td>
						{batch_info}
                        <td>{batch.batch_name}</td>
                        <td>{batch.crystals[0].single_compound.library_name}</td>
                        <td>{batch.crystals[0].single_compound.library_plate}</td>
                        <td>{batch.crystal_plate.name}</td>
                        <td>{batch.crystals.length}</td>
						
                        <td>
							{shifterExchange}
							{barcodeReaderExchange}
						</td>
						<td>
							<Show handleClick={this.showDetails} className={this.state.showClass}/>
							<Hide Show handleClick={this.hideDetails} className={this.state.hideClass} />
							{changeView}
						</td>
					</tr>
					<tr>
						<td colSpan="12" className={this.state.detailClass}>
							<div className={this.state.detailClass}>
								{details}
							</div>
						</td>
					</tr>
				</React.Fragment>
        );
    }*/
}

export default BatchRowHarvesting;