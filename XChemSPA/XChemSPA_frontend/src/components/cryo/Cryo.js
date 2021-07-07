import React from 'react';
import Soak from '../soak/Soak.js';
import CryoForm from './cryo_form.js';
import BatchRowCryo from './batch_row_cryo.js';
import BatchRowCocktailCryo from './batch_row_cocktails_cryo.js';
import { deepCopyObjectArray } from '../reusable_components/functions.js';
import { JSON_CSRF } from '../reusable_components/csrf.js';
import axios from 'axios';

export class Cryo extends Soak {

	constructor(props){
		super(props)
		this.showExtra = this.showExtra.bind(this);
		this.hideExtra = this.hideExtra.bind(this);
		this.setStartBatch = this.setStartBatch.bind(this);
		this.setEndBatch = this.setEndBatch.bind(this);
		this.generateFiles = this.generateFiles.bind(this);
		this.updateCryoStockConc=this.updateCryoStockConc.bind(this);
		this.updateCryoConc=this.updateCryoConc.bind(this);
		this.updateCryoLocation=this.updateCryoLocation.bind(this);
		
		this.state = {
			extraInfo: "hidden",
			showIconClass: "",
			hideIconClass: "hidden",
			applyToAll: true,
			startBatch: 0,
			endBatch: 0,
			cryoStockConc: null,
			cryoConc: null,
			cryoLocation: null,
			batches: [],
		}
	}

	getTitle(){
		return "Cryo";
	}

	getValueHeaders(){
		return (
			<React.Fragment>
				<th>Cryo stock<br/> concentration (%)</th>
				<th>Desired cryo<br/> concentration (%)</th>
				<th>Cryo <br/>location</th>
				<th>Cryo transfer <br/>volume</th>
				<th>Cryo status</th>
				<th>Cryo transfer<br/> date/time</th>
			</React.Fragment>
		);
	}

	componentDidMount(){
		this.props.switchActive("cryo");
		this.loadBatches();		
	}
	getForm(){
		return (<CryoForm 
			startBatch={this.state.startBatch} 
			endBatch={this.state.endBatch}
			setStartBatch = {this.setStartBatch}
			setEndBatch = {this.setEndBatch}
			updateCryoStockConc={this.updateCryoStockConc}
			updateCryoConc={this.updateCryoConc}
			updateCryoLocation={this.updateCryoLocation}
			generateFiles = {this.generateFiles}
		
		/>);
	}

	getTableRows(){
		const rows = this.state.batches.map(batch => {
			if (batch.crystals[0].single_compound){
				return (
					<BatchRowCryo 
						key={batch.number} 
						batch={batch} 
						extra={this.state.extraInfo}
						changeBatchStatus={this.changeBatchStatus}						
					/>);
				}
			else {
				return (
					<BatchRowCocktailCryo 
						key={batch.number} 
						batch={batch} 
						extra={this.state.extraInfo}
						changeBatchStatus={this.changeBatchStatus}
					/>);
				}
			}
		);
		return rows;
	}

	updateCryoStockConc(value){
		this.setState({cryoStockConc : value});
	}
    
	updateCryoConc(value){
		this.setState({cryoConc : value});
	}
    
	updateCryoLocation(value){
		this.setState({cryoLocation : value});
	}

	setBatchValues(batch){
		console.log('fired setBatchValues')
		batch.cryo_stock_frac = this.state.cryoStockConc;
		batch.cryo_frac = this.state.cryoConc;
		batch.cryo_location = this.state.cryoLocation
		this.setCryoTransferVolume(batch);
		if (batch.solv_frac && batch.stock_conc){
			batch.status = "Ready to generate input file for Echo."
		}
		else{
			batch.status = "Waiting for cryo parameters"
		}
	}

	setCryoTransferVolume(batch){
		const minUnit = 2.5; 		//minimum volume unit of the dispenser	

		const vol = (batch.crystal_plate.drop_volume * batch.cryo_frac) / (batch.cryo_stock_frac - batch.cryo_frac);
		const vol_rounded = Math.round(vol / minUnit) * minUnit; //round to nearest minUnit
		//batch.soak_vol = vol_rounded;	
		batch.cryo_transfer_vol = vol_rounded;
		
	}

	componentDidUpdate(prevProps, prevState){
		//after loading batches, set the start and end batch to the first and last batch from the list
		if (prevState.batches.length !== this.state.batches.length){
			const batches = this.state.batches;
			this.setState({
				startBatch : batches[0].number,
				endBatch : batches[batches.length - 1].number
			});
		}

		//set soaking parameters for all included batches each time user input changes
		if (prevState.cryoStockConc !== this.state.cryoStockConc || prevState.cryoConc !== this.state.cryoConc || prevState.cryoLocation !== this.state.cryoLocation){
			let batchesCopy = deepCopyObjectArray(this.state.batches);
			batchesCopy.forEach(batch=> {
				if (batch.included){
					this.setBatchValues(batch);
			}
			this.setState({batches : batchesCopy});
			});
		}
	}

	generateFiles(){
		//check if it makes sense to generate the files:
		this.state.batches.forEach(batch => {
			if (batch.included){
				if (batch.status === "Waiting for cryo parameters"){
					alert("Cryo stock concentration, desired cryo concentration and cryo location need to be set before generating files!");
					return;
				}
			}
		});

		let batchesCopy = deepCopyObjectArray(this.state.batches);
		batchesCopy.forEach(batch=> {
			if (batch.included && batch.status==="Ready to generate input file for Echo."){
				let token = [JSON_CSRF()]
				let data = new FormData();

				data.append("csrfmiddlewaretoken", token);
				data.append("cryo_transfer_vol", batch.cryo_transfer_vol);
				data.append("cryo_frac", batch.cryo_frac);
				data.append("cryo_stock_frac", batch.cryo_stock_frac);
				data.append("cryo_location", batch.cryo_location);

				const url = '/api/update_batch/' + batch.id + '/';
				axios.put(url, data);
				batch.status = "file";
			}
		});
		this.setState({batches : batchesCopy });
	}


}

export default Cryo;
