import React from 'react';
import PlateButtons from './plate_buttons.js';
//import hide from './Crystal gallery_files/hide.png';
import CrystalGroup from './crystal_group.js';
import { deepCopyObjectArray, removeFromArray } from '../reusable_components/functions.js';
import axios from 'axios';



function setClassOrHide(array, className){
	if (array.length === 0){
		return 'hide';
	}
	else {
		return className;
	}
}


class Plate extends React.Component {
	
	constructor(props) {
		super(props);
		//this.changeCrystalStatus = this.changeCrystalStatus.bind(this);
		this.deleteRejectedCrystals = this.deleteRejectedCrystals.bind(this);
		this.handleReject = this.handleReject.bind(this);
		this.handleAccept = this.handleAccept.bind(this);
		this.state = {
			displayStatus: this.getDisplayStatus(this.props.plate.crystals),
			selectedToRemove : []
		};
		
		this.hidePlate = this.hidePlate.bind(this);
		this.showPlate = this.showPlate.bind(this);
	}

	getDisplayStatus(crystals){
		let status = 'hide';
		try{
			if (crystals.filter(crystal => crystal.lab_data === null).length > 0){
				status = 'show-plate';
			}
		}
		catch(TypeError){
			return status;
		}
		return status;
	}
	
	hidePlate(){
		this.setState({displayStatus: 'hide'});
	}
	
	showPlate(){
		this.setState({displayStatus: 'show-plate'});
	}

	changeCrystalStatus(well, newStatus){
		this.props.changeCrystalAttribute(this.props.plate.id, well, "status", newStatus)
		}
		
	handleReject(crystal){
		this.changeCrystalStatus(crystal.well, 'rejected');
		let removeCopy = this.state.selectedToRemove;
		removeCopy.push(crystal.id);
		this.setState({selectedToRemove: removeCopy});
		this.props.updateAccepted(-1);
		this.props.updateRejected(1);
	}
	
	handleAccept(crystal){
		this.changeCrystalStatus(crystal.well, 'accepted');
		let removeCopy = this.state.selectedToRemove;
		removeCopy = removeFromArray(removeCopy, [crystal.id]);
		this.setState({selectedToRemove: removeCopy});
		this.props.updateAccepted(1);
		this.props.updateRejected(-1);
	}

	deleteRejectedCrystals(){
		this.state.selectedToRemove.forEach(crystal_id => {
			const apiUrl = '/api/delete_crystal/' + crystal_id+ '/';
			console.log(apiUrl);
			
			axios.delete(apiUrl);
			
		});
		this.props.loadData();
	}
	
	render() {
		let usedList = [];
		let acceptedList = [];
		let rejectedList = [];
		try {
//			usedList = this.state.crystals.filter(crystal => crystal.status === 'used');
//			acceptedList = this.state.crystals.filter(crystal => crystal.status === 'accepted');
//			rejectedList = this.state.crystals.filter(crystal => crystal.status === 'rejected');
			usedList = this.props.plate.crystals.filter(crystal => crystal.status === 'used');
			acceptedList = this.props.plate.crystals.filter(crystal => crystal.status === 'accepted');
			rejectedList = this.props.plate.crystals.filter(crystal => crystal.status === 'rejected');
		}
		catch(TypeError){
			usedList = [];
		}
		const plateName = this.props.plate.name;
		
		let sectionClass;
		if (acceptedList.length===0) {
			sectionClass = 'all-used';
		}
		let buttonStatus;
		
		if (usedList.length===0) {
			buttonStatus = 'unused';
			}
		
		let usedDivClass = setClassOrHide(usedList, 'crystal-group used-div');
		let acceptedDivClass = setClassOrHide(acceptedList, 'crystal-group accepted-div');
		let rejectedDivClass = setClassOrHide(rejectedList, 'crystal-group 	rejected-div');
		
				
		return (
		<section className={sectionClass} id={plateName}>
			<h2>Crystallisation plate: {plateName}</h2>
			<PlateButtons 
				displayStatus={this.state.displayStatus} 
				plateName={this.props.plate.name} 
				show={this.showPlate} 
				hide={this.hidePlate} 
				status={buttonStatus}
				deleteRejectedCrystals={this.deleteRejectedCrystals}
				rejectedCount = {rejectedList.length}
			/>
			<div>Drop volume: {this.props.plate.drop_volume}<br />
				Used: {usedList.length}<br />
				Accepted: {acceptedList.length}<br />
				Rejected: {rejectedList.length}
			</div>
			<div className={this.state.displayStatus}>
				<CrystalGroup 
					divClass={usedDivClass} 
					heading="Used crystals:"
					crystals={usedList}
					/>
				<CrystalGroup 
					divClass={acceptedDivClass} 
					heading="Accepted crystals:" 
					crystals={acceptedList} 
					iconAction={this.handleReject}
					changeCrystalAttribute = {this.props.changeCrystalAttribute}
					//changeScore = {this.props.changeScore}
					plate_id = {this.props.plate.id}

				/>
				<CrystalGroup 
					divClass={rejectedDivClass} 
					heading="Rejected crystals:" 
					crystals={rejectedList} 
					iconAction={this.handleAccept}
					changeCrystalAttribute = {this.props.changeCrystalAttribute}
					//changeScore = {this.props.changeScore}
					plate_id = {this.props.plate.id}
				/>
			</div>
		</section>
		);
	}
}

export default Plate;
