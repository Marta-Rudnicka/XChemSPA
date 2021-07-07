import React, { Component } from 'react';
import {batches} from '../batches/fake_data.js';

export class SoakForm extends Component {
	constructor(props){
		super(props);
		
		this.state = {
			disabled: true,
		}
		this.handleRadioChange = this.handleRadioChange.bind(this);
		this.getStockConc = this.getStockConc.bind(this);
	}

	handleRadioChange(value){
		if (value==="all"){
			this.setState({
				disabled : true, 
				startBatch : this.props.startBatch,
				endBatch : this.props.endBatch
			});
		}
		else {
			this.setState({disabled : false});
		}
	
	}

	getStockConc(event){
		this.props.updateStockConc(parseInt(event.target.value));
	}
	
	getSolventConc(event){
		this.props.updateSolvConc(parseInt(event.target.value));
	}
	
	getInputs(){
		return (
			<React.Fragment>
				<legend>Soaking parameters</legend>
				<div className="one-line-form-input">
					<label className="">Compound stock concentration (mM):</label>
					<input className="" type="number" onChange={event => this.getStockConc(event)}/>
				</div>
				<div className="one-line-form-input">
					<label className="">Desired solvent concentration (%):</label>
					<input className="" type="number" min="0" max="100" onChange={event => this.getSolventConc(event)} />
				</div>
			</React.Fragment>
		);
	}

    render() {
		const startBatch = this.props.startBatch;
		const endBatch = this.props.endBatch;
		const disabled = this.state.disabled;
				
        return (
			<div>
				<form>
					{this.getInputs()}
					<div>
					<p><strong>For batches:</strong></p>
						<input type="radio" name="range" value="all" onChange={() => this.handleRadioChange("all")} defaultChecked />
						<label htmlFor="all">All new batches</label>
						<br />
						<input type="radio" name="range" value="part" onChange={() => this.handleRadioChange("part")} />
						<label htmlFor="part">
							Batches from 
							<input type="number" value={startBatch}  step="1" disabled={disabled} onChange={() => this.props.setStartBatch(event.target.value)}/> 
								to 
							<input type="number" value={endBatch} step="1" disabled={disabled} onChange={() => this.props.setEndBatch(event.target.value)}/>
						</label>
					</div>
				</form>
				<button onClick={() => this.props.generateFiles()}>Create input files for Echo</button>
			</div>
        );
    }
}

export default SoakForm;
