import React, { Component } from 'react';
import {ChevronLeft, ChevronRight} from '../Icons.js';
import axios from 'axios';
import BatchRowHarvesting from './batch_row_harvesting.js';
import { BatchRowCocktailHarvesting } from './batch_row_cocktail_harvesting.js';

export class Harvesting extends Component {
	constructor(props){
		super(props)
		this.showExtra = this.showExtra.bind(this);
		this.hideExtra = this.hideExtra.bind(this);
		this.state = {
            batches: null,
            extraInfo: "hidden",
			showIconClass: "",
			hideIconClass: "hidden",
		}
	
	}
	
	componentDidMount(){
		this.props.switchActive("harvesting");
		this.loadBatches();		
	}

	loadBatches(){
		
		const apiUrl = '/api/batches/' + this.props.proposal + '/';
		axios.get(apiUrl)
		  .then(res => {
		   let batches = res.data;
		   this.setState({ batches});
		 });
	}
	getTableRows(){
		const rows = this.state.batches.map((batch, index) => {
			if (batch.crystals[0].single_compound){
				return <BatchRowHarvesting key={index} batch={batch} extra={this.state.extraInfo} />;
				}
			else {
				return <BatchRowCocktailHarvesting key={index} batch={batch} extra={this.state.extraInfo} />;
				}
			}
		);
		return rows;
	}

	showExtra(){
		this.setState({extraInfo: "extra-info", showIconClass: "hidden", hideIconClass: ""});
	}
	
	hideExtra(){
		this.setState({extraInfo: "hidden", showIconClass: "", hideIconClass: "hidden"});
	}

    render() {
        let batchRows = <tr><td colSpan="8">Loading...</td></tr>;

        if (this.state.batches){
            batchRows = this.getTableRows();
        }
    
        return (
				<div id="harvesting">
				  <h1>Harvesting</h1>
				  <main>
					<table className="table">
                        <thead>
                        <tr>
							<th>Batch
								<ChevronRight className={this.state.showIconClass} handleClick={this.showExtra}/>
								<ChevronLeft className={this.state.hideIconClass} handleClick={this.hideExtra}/> 
							</th>
                            <th className={this.state.extraInfo}>Drop volume</th>
							<th className={this.state.extraInfo}>Soaking time</th>
							<th className={this.state.extraInfo}>Soak transfer <br/>date/time</th>
							<th className={this.state.extraInfo}>Cryo transfer <br/>date/time</th>   							
                            <th>Batch name</th>
                            <th>Library</th>
                            <th>Library Plate</th>
                            <th>Crystallisation plate</th>
                            <th>Size (crystals)</th>
                            <th>Actions</th>
                            <th>Batch details</th>
                        </tr>
                        </thead>
                        <tbody>{batchRows}</tbody>
                    </table>			  
				  </main>
			</div>
        );
    }
}

export default Harvesting;