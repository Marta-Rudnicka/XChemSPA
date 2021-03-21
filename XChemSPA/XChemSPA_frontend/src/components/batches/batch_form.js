import React, { Component } from 'react';
import {Show, Hide} from '../Icons.js';

export class BatchForm extends Component {
	constructor(props){
		super(props);
		
		this.hideForms = this.hideForms.bind(this);
		this.showForms = this.showForms.bind(this);
		
		
		this.state = {
			combiUpload: 'hidden',
			formClass: 'hidden',
			showClass: ''
			}
	}
	
	hideForms(){
		this.setState({formClass: 'hidden', showClass: ''});
	}
	
	showForms(){
		this.setState({formClass: '', showClass: 'hidden'});
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
					<br />
					<input type="radio" name="batch-making-method" id="one-per-match" value="one-per-match" checked onChange={() => console.log('a')}/>
					<label htmlFor="one-per-match">1 batch per plate </label>
					<br />
					<input type="radio" name="batch-making-method" id="by-number-of-crystals" value="by-number-of-crystals" onChange={() => console.log('b')}/>
					<label htmlFor="number-of-crystals">
					<input id="number-of-crystals" type="number" min="16" step="16" onChange={event => console.log(event.target.value)}/> crystals per plate</label>
				  </fieldset>
				</form>
				
				<form id="soak-type-form" className={this.state.formClass}>
				  <fieldset>
					<legend>Choose soak type: </legend>
					<input type="radio" name="soak-type" id="single" value="single" onClick={() => this.pickSingleSoak()}/>
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
