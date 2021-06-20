import React, { Component } from 'react';
import {Show, Hide} from '../../Icons.js';
import {batches} from '../fake_data.js';
import BatchDetails from './batch_details.js';
import BatchDetailsBySoak from './batch_details_by_soak.js';

export class ExistingBatchRow extends Component {
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
	
	showDetails(){
		this.setState({detailClass: "container-cell", showClass: "hidden", hideClass: ""})
	}
	
	hideDetails(){
		this.setState({detailClass: "container-cell-hidden", showClass: "", hideClass: "hidden"})
	}
	
	handleCheckbox(event){
		if (event.target.checked){
			this.setState({detailsBySoak: true});
		}
		else {
			this.setState({detailsBySoak: false});
		}
	}
	
    render() {
		const batch = this.props.batch;
		
        return (
				<React.Fragment>
					<tr>
						<td>{batch.number}</td>
						<td>{batch.library}</td>
						<td>{batch.libraryPlate}</td>
						<td>{batch.crystalPlate}</td>
						<td>{batch.crystals.length}</td>
						<td>TODO</td>
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
						<td colSpan="7" className={this.state.detailClass}>
							<div className={this.state.detailClass}>
								{this.state.detailsBySoak ? <BatchDetailsBySoak batch={batch} /> : <BatchDetails type={batch.type} crystals={batch.crystals} />}
							</div>
						</td>
					</tr>
				</React.Fragment>
        );
    }
}

export default ExistingBatchRow;
