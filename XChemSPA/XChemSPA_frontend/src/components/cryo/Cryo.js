import React, { Component } from 'react';
import {Show, Hide, ChevronLeft, ChevronRight} from '../Icons.js';
import {batches} from '../batches/fake_data.js';
import BatchDetails from '../batches/old-batches/batch_details.js';
import ExistingBatchRow from '../batches/old-batches/existing_batch_row.js';
import SoakForm from '../soak/soak_form.js';

export class Cryo extends Component {
	constructor(props){
		super(props)
		this.showExtra = this.showExtra.bind(this);
		this.hideExtra = this.hideExtra.bind(this);
		this.state = {
			extraInfo: "hidden",
			showIconClass: "",
			hideIconClass: "hidden",
		}
	
	}
	
	showExtra(){
		this.setState({extraInfo: "extra-info", showIconClass: "hidden", hideIconClass: ""});
	}
	
	hideExtra(){
		this.setState({extraInfo: "hidden", showIconClass: "", hideIconClass: "hidden"});
	}
	
    render() {
        return (
				<div id="soak">
				  <h1>Soaking</h1>
				  <aside>
					<SoakForm />
				  </aside>
				  <main>
					<section>
					  <table className="table">
						<caption>Current batches</caption>
						<thead>
							<tr>
								<th>Batch <br/> number 
									<ChevronRight className={this.state.showIconClass} handleClick={this.showExtra}/>
									<ChevronLeft className={this.state.hideIconClass} handleClick={this.hideExtra}/> 
								</th>
								<th className={this.state.extraInfo}>Library</th>
								<th className={this.state.extraInfo}>Library <br/>plate</th>
								<th className={this.state.extraInfo}>Crystallisation <br/>plate</th>
								<th>Size <br/>(crystals)</th>
								<th>Status</th>
								<th>Compound<br/> concentration (mM)</th>
								<th>Solvent <br/>concentration (%)</th>
								<th>Transfer <br/>volume</th>
								<th>Soak status</th>
								<th>Soak transfer<br/> date/time</th>
								<th>Details</th>
							</tr>
						</thead>				
						<tbody>
							<tr>
								<td>[TODO]</td>
								<td className={this.state.extraInfo}>[TODO]</td>
								<td className={this.state.extraInfo}>[TODO]</td>
								<td className={this.state.extraInfo}>[TODO]</td>
								<td>[TODO]</td>
								<td>[TODO]</td>
								<td>[TODO]</td>
								<td>[TODO]</td>
								<td>[TODO]</td>
								<td>[TODO]</td>
								<td>[TODO]</td>
								<td><Show /><Hide /></td>
							</tr>
						</tbody>
					</table>
					</section>
				</main>	
			</div>
        );
    }
}

export default Cryo;
