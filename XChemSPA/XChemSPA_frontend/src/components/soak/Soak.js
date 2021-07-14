import React, { Component } from 'react';
import {ChevronLeft, ChevronRight} from '../Icons.js';
import BatchRowSoak from './batch_row_soak.js';
import BatchRowCocktailSoak from './batch_row_cocktails_soak.js';
import SoakForm from './soak_form.js';
import axios from 'axios';
import { deepCopyObjectArray } from '../reusable_components/functions.js';
import { JSON_CSRF } from '../reusable_components/csrf.js'


export class Soak extends Component {
	constructor(props){
		super(props)
		this.showExtra = this.showExtra.bind(this);
		this.hideExtra = this.hideExtra.bind(this);
		this.updateStockConc = this.updateStockConc.bind(this);
		this.updateSolvConc = this.updateSolvConc.bind(this);
		this.setStartBatch = this.setStartBatch.bind(this);
		this.setEndBatch = this.setEndBatch.bind(this);
		this.generateFiles = this.generateFiles.bind(this);
		this.changeBatchStatus = this.changeBatchStatus.bind(this);
		
		this.state = {
			extraInfo: "hidden",
			showIconClass: "",
			hideIconClass: "hidden",
			applyToAll: true,
			startBatch: 0,
			endBatch: 0,
			stockConc: null,
			solvConc: null,
			batches: [],
			initialBatchStatus: "Waiting for soak parameters",
		}
	
	}
	
	/* LOAD DATA */
	componentDidMount(){
		this.props.switchActive("soak");
		this.loadBatches();		
	}

	loadBatches(){
		
		const apiUrl = '/api/batches/' + this.props.proposal + '/';
		axios.get(apiUrl)
		  .then(res => {
		   let batches = res.data;
		   batches = this.addInitialBatchData(batches)
		   this.setState({ batches});
		 });
	}

	addInitialBatchData(batches){
		batches.forEach(batch => {
			batch.included = true;
			if (batch.soak_status){
				batch.status = batch.soak_status;
			}
			else{
				batch.status = this.state.initialBatchStatus; 
			}
		})
		return batches;
	}
	
	/* MANAGE DISPLAY */
	showExtra(){
		this.setState({extraInfo: "extra-info", showIconClass: "hidden", hideIconClass: ""});
	}
	
	hideExtra(){
		this.setState({extraInfo: "hidden", showIconClass: "", hideIconClass: "hidden"});
	}
	
	/*SET BATCH PROPERTIES BASED ON USER INPUT */

	updateStockConc(value){
		this.setState({stockConc : value});
	}

	updateSolvConc(value){
		this.setState({solvConc : value});
	}
	
	setBatchValues(batch){
		batch.solv_frac = this.state.solvConc;
		batch.stock_conc = this.state.stockConc;
		this.setTransferVolume(batch);
		this.setCompoundConc(batch);
		if (batch.solv_frac && batch.stock_conc){
			batch.status = "Ready to generate input file for Echo."
		}
		else{
			batch.status = this.state.initialBatchStatus;
		}
	}

	setTransferVolume(batch){
		const minUnit = 2.5; 		//minimum volume unit of the dispenser		
		const vol = (batch.crystal_plate.drop_volume * batch.solv_frac) / (100 - batch.solv_frac);
		const vol_rounded = Math.round(vol / minUnit) * minUnit; //round to nearest minUnit
		batch.soak_vol = vol_rounded;	
		
	}
	
	setCompoundConc(batch){
		const minUnit = 2.5; 		//minimum volume unit of the dispenser
		const conc = (batch.stock_conc * batch.soak_vol) / (batch.crystal_plate.drop_volume + batch.soak_vol);
		const conc_rounded = Math.round(conc);
		batch.expr_conc = conc_rounded;	
	}

	changeBatchStatus(batch, status){
		let batchesCopy = deepCopyObjectArray(this.state.batches);
		let mod = batchesCopy.find(b => b.id === batch.id)
		mod.status = status;
		this.setState({batches: batchesCopy});

	}

	/* DETERMINE WHICH BATCHES ARE PROCESSED */

	setStartBatch(value){
		const batches = this.state.batches;
		//don't do anything for invalid values
		if (value > this.state.endBatch || value < batches[0].number){
			return;
		}
		let batchesCopy = deepCopyObjectArray(batches);
		batchesCopy.forEach(batch=> {
			this.includeExcludeBatch(batch, value, this.state.endBatch);
		});
		this.setState({startBatch : value, batches: batchesCopy});
	}

	setEndBatch(value){
		const batches = this.state.batches;

		//don't do anything for invalid values
		if (value < this.state.startBatch || value > batches[batches.length-1].number){
			return;
		}
		let batchesCopy = deepCopyObjectArray(batches);
		batchesCopy.forEach(batch=> {
			this.includeExcludeBatch(batch, this.state.startBatch, value);
		});
		this.setState({endBatch : value, batches: batchesCopy});
	}

	includeExcludeBatch(batch, start, end){
		if (batch.number >= start && batch.number <= end){
			this.includeBatch(batch)
		}
		else{
			this.excludeBatch(batch)
		}
	}

	excludeBatch(batch){
		batch.included = false;
		batch.solv_frac = null;
		batch.stock_conc = null;
		batch.soak_vol = null;
		batch.expr_conc = null;
		batch.status = this.state.initialBatchStatus;
	}

	includeBatch(batch){
		batch.included = true;
		this.setBatchValues(batch);
	}

	/* MIXED */
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
		if (prevState.stockConc !== this.state.stockConc || prevState.solvConc !== this.state.solvConc){
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
				if (batch.status === this.state.initialBatchStatus){
					alert("Compound stock concentration and desired solvent concentration need to be set before generating files!");
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
				data.append("soak_vol", batch.soak_vol);
				data.append("solv_frac", batch.solv_frac);
				data.append("stock_conc", batch.stock_conc);
				data.append("expr_conc", batch.expr_conc);
				data.append("soak_status", "file")

				const url = '/api/update_batch/' + batch.id + '/';
				axios.put(url, data);
				batch.status = "file";
			}
		});
		this.setState({batches : batchesCopy });

	}

	/* GENERATE ELEMENTS (written as methods to be overwritten in subclasses)*/
	getTitle(){
		return "Soak";
	}

	getForm(){
		return (<SoakForm 
			startBatch={this.state.startBatch} 
			endBatch={this.state.endBatch}
			setStartBatch = {this.setStartBatch}
			setEndBatch = {this.setEndBatch}
			updateStockConc={this.updateStockConc}
			updateSolvConc={this.updateSolvConc}
			generateFiles = {this.generateFiles}
		
		/>);
	}

	getValueHeaders(){
		return (
			<React.Fragment>
				<th>Compound stock<br/> concentration (mM)</th>
				<th>Compound<br/> concentration (mM)</th>
				<th>Solvent <br/>concentration (%)</th>
				<th>Transfer <br/>volume</th>
				<th>Soak status</th>
				<th>Soak transfer<br/> date/time</th>
			</React.Fragment>
		);
	}

	getTableRows(){
		const rows = this.state.batches.map(batch => {
			if (batch.crystals[0].single_compound){
				return (
					<BatchRowSoak 
						key={batch.number} 
						batch={batch} 
						extra={this.state.extraInfo}
						changeBatchStatus={this.changeBatchStatus}				
					/>);
				}
			else {
				return (
					<BatchRowCocktailSoak 
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

    render() {
		let batch_rows = <tr><td>Loading ...</td></tr>;
		if (this.state.batches){
			batch_rows = this.getTableRows();
		}
		
		console.log('batch_rows: ', batch_rows)
        return (
				<div id="soak">
				  <h1>{this.getTitle()}</h1>
				  <aside>
					  {this.getForm()}
				  </aside>
				  <main>
					<section>
					  <table className="table">
						<caption>Current batches</caption>
						<thead>
							<tr>
								<th>Batch
									<ChevronRight className={this.state.showIconClass} handleClick={this.showExtra}/>
									<ChevronLeft className={this.state.hideIconClass} handleClick={this.hideExtra}/> 
								</th>
								<th className={this.state.extraInfo}>Library</th>
								<th className={this.state.extraInfo}>Library <br/>plate</th>
								<th className={this.state.extraInfo}>Crystallisation <br/>plate</th>
								<th className={this.state.extraInfo}>Drop <br/>volume</th>
								<th className={this.state.extraInfo}>Size <br/>(crystals)</th>
								{this.getValueHeaders()}

								<th>Batch <br/> contents</th>
							</tr>
						</thead>				
						<tbody>
							{batch_rows}
						</tbody>
					</table>
					</section>
				</main>	
			</div>
        );
    }
}

export default Soak;
