import React, { Component } from 'react';
import {Show, Hide} from '../../Icons.js';
import BatchDetails from './batch_details.js';

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
	
	getLibraryCell(){
		return <td>{this.props.batch.crystals[0].single_compound.library_name}</td>;
	}

	getPlateCell(){
		return <td>{this.props.batch.crystals[0].single_compound.library_plate}</td>;
	}

	getChangeView(){
		return null; //overwritten in ExistingBatchRowCocktail
	}
	
	getBatchDetails(){
		return <BatchDetails crystals={this.props.batch.crystals} />
	}
	
    render() {
		const batch = this.props.batch;
		const libraryCell = this.getLibraryCell();
		const plateCell = this.getPlateCell();
		const changeView = this.getChangeView();
		const details = this.getBatchDetails();
		
        return (
				<React.Fragment>
					<tr>
						<td>{batch.number}</td>
						{libraryCell}
						{plateCell}
						
						<td>{batch.crystal_plate.name}</td>
						<td>{batch.crystals.length}</td>
						<td>TODO</td>
						<td>
							<Show handleClick={this.showDetails} className={this.state.showClass}/>
							<Hide Show handleClick={this.hideDetails} className={this.state.hideClass} />
							{changeView}
						</td>
					</tr>	
					<tr>
						<td colSpan="7" className={this.state.detailClass}>
							<div className={this.state.detailClass}>
								{details}
							</div>
						</td>
					</tr>
				</React.Fragment>
        );
    }
}

export default ExistingBatchRow;
