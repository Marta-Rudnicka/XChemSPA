import React from 'react';
import {Show, Hide} from '../Icons.js';
import ExistingBatchRow from '../batches/old-batches/existing_batch_row.js';

export class BatchRowSoak extends ExistingBatchRow {

	constructor(props){
		super(props)
		this.showDetails = this.showDetails.bind(this);
		this.hideDetails = this.hideDetails.bind(this);
		this.state = {
			detailClass: "container-cell-hidden",
			showClass: "",
			hideClass: "hidden",
			detailsBySoak: false,
			path : '/exports/echo-soak/',
		}
	}
	
	makeBatchInfo(){
		const batch = this.props.batch;
		return (
			<React.Fragment>
				<td className={this.props.extra}>{batch.crystals[0].single_compound.library_name}</td>
				<td className={this.props.extra}>{batch.crystals[0].single_compound.library_plate}</td>
				<td className={this.props.extra}>{batch.crystal_plate.name}</td>
				<td className={this.props.extra}>{batch.crystal_plate.drop_volume}</td>
				<td className={this.props.extra}>{batch.crystals.length}</td>
			</React.Fragment>
		);
	}

	makeDownloadLinks(){
		return <a href={this.state.path + this.props.batch.id + '/0/'} onClick={() => this.handleFileDownload()}>Download Echo file</a>;
	}

	makeNewValues(){
		const batch = this.props.batch;
		return (
			<React.Fragment>
				<td>{batch.stock_conc}</td>
				<td className="auto-calc">{batch.expr_conc}</td>
				<td>{batch.solv_frac}</td>
				<td className="auto-calc">{batch.soak_vol}</td>
			</React.Fragment>
		);
	}

	getStatus(){
		let status = this.props.batch.status;
		if (status==="file"){
			status = this.makeDownloadLinks();
		}
		if (status==="start"){
			status = <button onClick={() => this.startSoak()}>Start soaking</button>
		}
		return status;
	}

	startSoak(){
		console.log('start soaking');
	}

	handleFileDownload(){
		this.props.changeBatchStatus(this.props.batch, "start");
	}

    render() {
		
		const batch = this.props.batch;
		const details = this.getBatchDetails();
		const batch_info = this.makeBatchInfo();
		const changeView = this.getChangeView();
		const status = this.getStatus();
		
        return (
				<React.Fragment>
					<tr className={!batch.included ? "excluded" : ""}>
						<td>{batch.number}</td>
						{batch_info}
						{this.makeNewValues()}
						<td>{status} </td>
						<td>N/A</td>
						<td>
							<Show handleClick={this.showDetails} className={this.state.showClass}/>
							<Hide Show handleClick={this.hideDetails} className={this.state.hideClass} />
							{changeView}
						</td>
					</tr>
					<tr>
						<td colSpan="12" className={this.state.detailClass}>
							{details}
						</td>
					</tr>
				</React.Fragment>
        );
    }
}

export default BatchRowSoak;
