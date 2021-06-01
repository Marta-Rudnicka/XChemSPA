import React, { Component } from 'react';
import {batches} from '../batches/fake_data.js';

export class SoakForm extends Component {
	constructor(props){
		super(props);
		
		this.state = {
			disabled: true,
			startBatch: this.props.firstBatch,
			endBatch: this.props.lastBatch,
		}
		this.setStartBatch = this.setStartBatch.bind(this);
		this.setEndBatch = this.setEndBatch.bind(this);
		this.handleRadioChange = this.handleRadioChange.bind(this);
		this.getStockConc = this.getStockConc.bind(this);
	}
	
	setStartBatch(value){
		const val = parseInt(event.target.value);
		this.setState({startBatch : val});
		this.props.getRange("part", val, this.state.endBatch )
	}
	
	setEndBatch(value){
		const val = parseInt(event.target.value);
		this.setState({endBatch : val});
		this.props.getRange("part", this.state.startBatch, val );
	}
	
	handleRadioChange(value){
		if (value==="all"){
			this.props.getRange("all", 0, 0);
			this.setState({disabled : true, 
				startBatch : this.props.firstBatch,
				endBatch : this.props.lastBatch});
		}
		else {
			this.props.getRange("part", this.state.startBatch, this.state.endBatch );
			this.setState({disabled : false});
		}
	
	}
	
	componentDidUpdate(prevProps){
		if (this.props.firstBatch !== prevProps.firstBatch) {
			this.setState({startBatch: this.props.firstBatch});
		}
		if (this.props.lastBatch !== prevProps.lastBatch) {
			this.setState({endBatch: this.props.lastBatch});
		}	
	}
	
	getStockConc(event){
		this.props.updateStockConc(parseInt(event.target.value));
	}
	
	getSolventConc(event){
		this.props.updateSolvConc(parseInt(event.target.value));
	}
	
    render() {
		const firstBatch = this.props.firstBatch;
		const lastBatch = this.props.lastBatch;
		const disabled = this.state.disabled;
				
        return (
				<form>
					<legend>Soaking parameters</legend>
					<label>Compound stock concentration (mM):</label>
					<input type="number" onChange={event => this.getStockConc(event)}/>
					<br />
					<label>Desired solvent concentration (%):</label>
					<input type="number" min="0" max="100" onChange={event => this.getSolventConc(event)} />
					<br />
					<label>For batches:</label>
					<br />
					<input type="radio" name="range" value="all" onChange={() => this.handleRadioChange("all")} defaultChecked />
					<label htmlFor="all">All new batches</label>
					<br />
					<input type="radio" name="range" value="part" onChange={() => this.handleRadioChange("part")} />
					<label htmlFor="part">
						Batches from 
						<input type="number" value={this.state.startBatch} min={firstBatch} max={lastBatch} step="1" disabled={disabled} onChange={() => this.setStartBatch(event.target.value)}/> 
							to 
						<input type="number" value={this.state.endBatch} min={firstBatch} max={lastBatch} step="1" disabled={disabled} onChange={() => this.setEndBatch(event.target.value)}/>
					</label>
					<button type="submit">Create input files for Echo</button>	
				</form>
        );
    }
}

export default SoakForm;
