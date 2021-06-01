import React, { Component } from 'react';
import {Show, Hide, ChevronLeft, ChevronRight} from '../Icons.js';
import {batches} from '../batches/fake_data.js';
//import BatchDetails from '../batches/batch_details.js';
import BatchRowSoak from './batch_row_soak.js';
import SoakForm from './soak_form.js';

export class Soak extends Component {
	constructor(props){
		super(props)
		this.showExtra = this.showExtra.bind(this);
		this.hideExtra = this.hideExtra.bind(this);
		this.getStartBatch = this.getStartBatch.bind(this);
		this.getEndBatch = this.getEndBatch.bind(this);
		this.getRange = this.getRange.bind(this);
		this.updateStockConc = this.updateStockConc.bind(this);
		this.updateSolvConc = this.updateSolvConc.bind(this);
		
		this.state = {
			extraInfo: "hidden",
			showIconClass: "",
			hideIconClass: "hidden",
			applyToAll: true,
			startBatch: 0,
			endBatch: 0,
			firstBatch: 7,
			lastBatch: 8,
			stockConc: null,
			solvConc: null,
			batches: batches,
		}
	
	}
	
	showExtra(){
		this.setState({extraInfo: "extra-info", showIconClass: "hidden", hideIconClass: ""});
	}
	
	hideExtra(){
		this.setState({extraInfo: "hidden", showIconClass: "", hideIconClass: "hidden"});
	}
	
	getFirstBatch(){
		let start = this.state.batches[0].number;
		this.state.batches.forEach(batch => {
			if (batch.number < start){
				start = batch.number
			}
		});
		return start;
	}
	
	getLastBatch(){
		let end = this.state.batches[0].number;
		this.state.batches.forEach(batch => {
			if (batch.number > end){
				end = batch.number
			}
		});
		return end;
	}
	
	getStartBatch(index){
		if (index === -1){
			this.setState({startBatch: this.getFirstBatch()});
		}
		else {
			this.setState({startBatch: index});
		}	
	}
	
	getEndBatch(index){
		if (index === -1){
			
			this.setState({endBatch: this.getLastBatch()});
		}
		else {
			this.setState({endBatch: index});
		}	
	}

	getRange(value, start, end){
		if (value === "all"){
			this.setState({applyToAll: true});
			this.getStartBatch(-1);
			this.getEndBatch(-1);
		}
		else{
			this.getStartBatch(-1);
			this.getEndBatch(-1);
		}
	}

	componentDidMount(){
		this.props.switchActive("soak");
		const first = this.getFirstBatch()
		const last = this.getLastBatch()
		this.setState({firstBatch : first, lastBatch: last, startBatch: first, endBatch: last});
				
	}
	
	updateStockConc(value){
		this.setState({stockConc: value});
	}
	updateSolvConc(value){
		this.setState({solvConc: value});
	}
	
    render() {
		const batch_rows = this.state.batches.map(batch => {
			return (
				<BatchRowSoak 
					key={batch.number} 
					batch={batch} 
					extra={this.state.extraInfo}
					
					startBatch={this.state.startBatch}
					endBatch={this.state.endBatch}					
					stockConc={this.state.stockConc} 
					solvConc={this.state.solvConc} 
				/>
				);
			}
		);
		
		
        return (
				<div id="soak">
				  <h1>Soaking</h1>
				  <aside>
					<SoakForm 
						firstBatch={this.state.firstBatch} 
						lastBatch={this.state.lastBatch} 
						getRange={this.getRange}
						updateStockConc={this.updateStockConc}
						updateSolvConc={this.updateSolvConc}
					
					/>
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
								<th>Compound stock<br/> concentration (mM)</th>
								<th>Compound<br/> concentration (mM)</th>
								<th>Solvent <br/>concentration (%)</th>
								<th>Transfer <br/>volume</th>
								<th>Soak status</th>
								<th>Soak transfer<br/> date/time</th>
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
