import React, { Component } from 'react';
import {Show, Hide} from '../Icons.js';
import {batches} from '../batches/fake_data.js';
import ExistingBatchRow from '../batches/existing_batch_row.js';
import BatchDetails from '../batches/batch_details.js';
import BatchDetailsBySoak from '../batches/batch_details_by_soak.js';

export class BatchRowSoak extends ExistingBatchRow {
	
	getTransferVolume(){
		const minUnit = 2.5; 		//minimum volume unit of the dispenser
		
		const vol = (this.props.batch.dropVolume * this.props.solvConc) / (100 - this.props.solvConc);
		const vol_rounded = Math.round(vol / minUnit) * minUnit; //round to nearest minUnit
		return vol_rounded;	
		
	}
	
	getCompoundConc(transferVol){
		const minUnit = 2.5; 		//minimum volume unit of the dispenser
		console.log("transferVol: ", transferVol, ", this.props.stockConc: ", this.props.stockConc, ", this.props.batch.dropVolume : ",this.props.batch.dropVolume);
		const conc = (this.props.stockConc * transferVol) / (this.props.batch.dropVolume + transferVol);
		const conc_rounded = Math.round(conc);
		return conc_rounded;	
	}
	
    render() {
		
		const batch = this.props.batch;
		const tv = this.getTransferVolume();
		const cc = this.getCompoundConc(tv);
				
        return (
				<React.Fragment>
					<tr>
						<td>{batch.number}</td>
						<td className={this.props.extra}>{batch.library}</td>
						<td className={this.props.extra}>{batch.libraryPlate}</td>
						<td className={this.props.extra}>{batch.crystalPlate}</td>
						<td className={this.props.extra}>{batch.dropVolume}</td>
						<td className={this.props.extra}>{batch.crystals.length}</td>
						<td>{this.props.stockConc}</td>
						<td className="auto-calc">{cc}</td>
						<td>{this.props.solvConc}</td>
						<td className="auto-calc">{tv}</td>
						<td>Ready to produce input for Echo </td>
						<td>N/A</td>
						<td>
							<Show handleClick={this.showDetails} className={this.state.showClass}/>
							<Hide Show handleClick={this.hideDetails} className={this.state.hideClass} />
							{ (batch.type==="multi") ? 
								<div>
									<input type="checkbox" onChange={event => this.handleCheckbox(event)} className={this.state.hideClass} />
									<label className={this.state.hideClass}>view by soak</label>
								</div> 
								: null 
							}
						</td>
					</tr>
					<tr>
						<td colSpan="12" className={this.state.detailClass}>
							{this.state.detailsBySoak ? <BatchDetailsBySoak batch={batch} /> : <BatchDetails type={batch.type} crystals={batch.crystals} />}
						</td>
					</tr>
				</React.Fragment>
        );
    }
}

export default BatchRowSoak;
