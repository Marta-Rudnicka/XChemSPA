import React from 'react';
import {Show, Hide} from '../Icons.js';
import ExistingBatchRow from '../batches/old-batches/existing_batch_row.js';
import { leadingZero } from '../reusable_components/functions.js';
import axios from 'axios';
import { JSON_CSRF } from '../reusable_components/csrf.js';
import { timestampMixin } from '../reusable_components/timestamp_mixin.js';

export class BatchRowSoak extends timestampMixin(ExistingBatchRow) {

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
			transferTime: this.props.batch.soak_timestamp ? new Date(Date.parse(this.props.batch.soak_timestamp)) : null,
			elapsedTime: null,
		}
	}
	
	componentDidMount(){
		if (this.props.batch.status === "soaking"){
			this.measureTime();
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
		if (status=="soaking"){
			const duration = this.printTimeDelta();
			status = (
				<div>
					<p>Soaking </p>
					<p>Soaking time (h:min): {duration} </p>
					<p><button onClick={() => this.stopSoak()}>Stop soaking</button> </p>
				</div>
			);
		}
		return status;
	}

	startSoak(){
		const timestamp = new Date();
		this.saveTimestamp(timestamp);
		this.props.changeBatchStatus(this.props.batch, "soaking");
		this.setState({transferTime: timestamp});
		this.measureTime();
	}

	stopSoak(){
		this.saveSoakTime();
		this.props.changeBatchStatus(this.props.batch, "done");
	}
	
	measureTime(){
		console.log('fired measureTime')
		setInterval(()=>{
			if(this.props.batch.status === "soaking"){
				const delta = new Date() - this.state.transferTime;
				this.setState({elapsedTime : delta});
			}
		}, 5000);
	}

	saveTimestamp(date){
		let token = [JSON_CSRF()]
		let data = new FormData(); 
		data.append("csrfmiddlewaretoken", token);
		data.append("date_str", date.toUTCString());

		const url = '/exports/save-timestamp/' + this.props.batch.id + '/soak_timestamp/';
		axios.post(url, data);
	}

	saveSoakTime(){
		let token = [JSON_CSRF()]
		let data = new FormData();
		const date = new Date();
		data.append("csrfmiddlewaretoken", token);
		data.append("date_str", date.toUTCString());

		const url = '/exports/save-soak-time/' + this.props.batch.id + '/';
		axios.post(url, data);
	}
/*
	printDate(date){
		console.log('test changes in printDate')
		if (!date){
			return null;
		}
		if (!(date instanceof Date)){
			date = new Date(Date.parse(date));
		}
		const year = String(date.getFullYear());
		const month = leadingZero(String(date.getMonth() + 1));
		const day = leadingZero(String(date.getDate()));
		const hours = leadingZero(String(date.getHours()));
		const minutes = leadingZero(String(date.getMinutes()));

		return (year + '-' + month + '-' + day + '  ' + hours + ':' + minutes)
	}

	printTimeDelta(){
		const all_minutes = Math.floor(this.state.elapsedTime / 60000);
		const hours = String(Math.floor(all_minutes/60));
		const minutes = leadingZero(String(all_minutes % 60))
		return hours + ':' + minutes;
	}
*/
	handleFileDownload(){
		this.props.changeBatchStatus(this.props.batch, "start");
	}

    render() {
		
		const batch = this.props.batch;
		const details = this.getBatchDetails();
		const batch_info = this.makeBatchInfo();
		const changeView = this.getChangeView();
		const status = this.getStatus();
		const transferTime = this.printDate(this.state.transferTime);
		
        return (
				<React.Fragment>
					<tr className={!batch.included ? "excluded" : ""}>
						<td>{batch.number}</td>
						{batch_info}
						{this.makeNewValues()}
						<td>{status} </td>
						<td>{transferTime}</td>
						<td>
							<Show handleClick={this.showDetails} className={this.state.showClass}/>
							<Hide Show handleClick={this.hideDetails} className={this.state.hideClass} />
							{changeView}
						</td>
					</tr>
					<tr>
						<td colSpan="12" className={this.state.detailClass}>
							<div className={this.state.detailClass}>
								{details}
							</div>
						</td>
					</tr>
				</React.Fragment>
        );
    }
}

export default BatchRowSoak;
