import React, { Component } from 'react';
import {Show, Hide} from '../../Icons.js';
import {batches} from '../fake_data.js';
import BatchDetails from './batch_details.js';
import ExistingBatchRow from './existing_batch_row.js';
import ExistingBatchRowCocktail from './existing_batch_row_cocktail.js';

export class ExistingBatches extends Component {
	constructor(props){
		super(props)
		this.hideTable = this.hideTable.bind(this);
		this.showTable = this.showTable.bind(this);
		this.state = {
			tableClass: "hidden",
			showIconClass: ""
		}
	
	}
	
	hideTable(){
		this.setState({tableClass: "hidden", showIconClass: ""})
	}
	
	showTable(){
		this.setState({tableClass: "", showIconClass: "hidden"})
	}
	
    render() {
		let batch_rows = null;
		if (this.props.batches) {
			batch_rows = this.props.batches.map((batch, index) => {
				if(batch.crystals[0].single_compound){
					return <ExistingBatchRow key={index} batch={batch} />
				}
				else{
					return <ExistingBatchRowCocktail key={index} batch={batch} />;
				}
			});
		}

        return (
				<section id="existing-batches" >
					<table className="table" id="table">
						<caption>Existing batches <Hide className={this.state.tableClass} handleClick={this.hideTable} /> <Show className={this.state.showIconClass} handleClick={this.showTable}/></caption>
						<thead className={this.state.tableClass}>
							<tr>
								<th>Batch <br/> number </th>
								<th>Library</th>
								<th>Library <br/>plate</th>
								<th>Crystallisation <br/>plate</th>
								<th>Size*</th>
								<th>Status</th>
								<th>Details</th>
							</tr>
						</thead>				
						<tbody className={this.state.tableClass}>
							{batch_rows}
						</tbody>
					</table>
				</section>	
        );
    }
}

export default ExistingBatches;
