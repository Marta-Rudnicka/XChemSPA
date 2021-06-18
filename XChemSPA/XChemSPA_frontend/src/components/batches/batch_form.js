import React, { Component } from 'react';
import {Show, Hide} from '../Icons.js';

export class BatchForm extends Component {
	constructor(props){
		super(props);
		
		this.hideForms = this.hideForms.bind(this);
		this.showForms = this.showForms.bind(this);
		this.pickBatchSize = this.pickBatchSize.bind(this);
//		this.changeCrystalsPerBatch = this.changeCrystalsPerBatch.bind(this);
		
		this.state = {
			combiUpload: 'hidden',
			formClass: 'hidden',
			showClass: '',
			batchMode: "one-batch-per-plate",
			crystalsPerBatch: 16,
			}
	}
	
	hideForms(){
		this.setState({formClass: 'hidden', showClass: ''});
	}
	
	showForms(){
		this.setState({formClass: '', showClass: 'hidden'});
	}
	
	pickBatchSize(event){

		const val = event.target.value;
		const int = parseInt(val);

		if (isNaN(int)){
			this.setState({batchMode : val});
			if (val === "fixed-sized-batches"){
				this.props.setBatchSize(this.state.crystalsPerBatch);
				//the value in the state have been there for a while,
				//so can be used here
			}
			else {
				this.props.setBatchSize(0);
			}
		}
		else {
			this.setState({crystalsPerBatch: int});
			if (this.state.batchMode === "fixed-sized-batches"){
				this.props.setBatchSize(int);
				//using <int> instead of <state.crystalsPerBatch>
				//because the state might not be updated at this point
			}
		}
	}

	pickSingleSoak(){
		this.setState({combiUpload: 'hidden'});
		this.props.changeSingleSoak(true);
	}
	
	pickMultiSoak(){
		this.setState({combiUpload: ''});
		this.props.changeSingleSoak(false);
	}
	
    render() {
        return (
			<section id="batch-forms">
			  <h4 id="batch-forms-header">Batch creation options <Show className={this.state.showClass} handleClick={this.showForms}/> <Hide className={this.state.formClass} handleClick={this.hideForms}/> </h4>
			   <form id="batch-size-form" className={this.state.formClass}>
			     <fieldset>
					<legend>Specify batch size:</legend>
					<div onChange={this.pickBatchSize}>
						<input type="radio" name="batch-making-method" value="one-batch-per-plate" defaultChecked={this.state.batchMode === "one-batch-per-plate"}/>
						<label htmlFor="one-per-match">1 batch per plate </label>
						<br />
						<input type="radio" name="batch-making-method" value="fixed-sized-batches" defaultChecked={this.state.batchMode === "fixed-sized-batches"} />
						<label htmlFor="number-of-crystals">
						<input 
							id="number-of-crystals" 
							type="number" 
							min="16" 
							step="16" 
							value={this.state.crystalsPerBatch} 
							onChange={() => {return}} //dummy function to silence warnings; chnages handled by the parent div
							/> crystals per plate</label>
					</div>
				  </fieldset>
				</form>
				
				<form id="soak-type-form" className={this.state.formClass}>
				  <fieldset>
					<legend>Choose soak type: </legend>
					<input type="radio" name="soak-type" id="single" value="single" onClick={() => this.pickSingleSoak()} defaultChecked />
					<label htmlFor="single">One compound per crystal</label>
					<br />
					<input type="radio" name="soak-type" id="multi" value="multi" onClick={() => this.pickMultiSoak()} />
					<label htmlFor="multi">Multiple compounds per crystal (combi-soak/cocktail)</label>
					<br />
					<div className={this.state.combiUpload}>
						<label htmlFor="combi-csv">Upload combination list: </label>
						<input type="file" id="combi-csv" />
					</div>
				  </fieldset>
				</form>
			</section>
        );
    }
}

export default BatchForm;
