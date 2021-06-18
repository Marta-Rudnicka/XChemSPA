import React from 'react';
//import './Crystal gallery_files/crystals.css';

import Sidebar from './crystal_sidebar.js';
import Plate from './crystallisation_plate.js';
import axios from 'axios';
import { deepCopyObjectArray, changeAndTrack } from '../reusable_components/functions.js';




//function App() {
class Crystals extends React.Component {
	
	constructor(props) {
		super(props);
		

		this.filterByScore = this.filterByScore.bind(this);
		this.updateAccepted = this.updateAccepted.bind(this);
		this.updateRejected = this.updateRejected.bind(this);
		this.updateUsed = this.updateUsed.bind(this);
		this.loadData = this.loadData.bind(this);
		this.changeScore = this.changeScore.bind(this);
		this.changeCrystalAttribute = this.changeCrystalAttribute.bind(this);

		this.state = {
			crystal_plates: [],
			accepted: 0,
			rejected: 0,
			used: 0,
		};
	}

	componentDidMount(){
		this.loadData();
		this.props.switchActive("crystals");
	}

	loadData(){
		const apiUrl = '/api/crystal_plates/' + this.props.proposal + '/';
		axios.get(apiUrl)
        .then(res => {
        	const crystal_plates = res.data;
			crystal_plates.forEach(plate => {
				this.addStatus(plate.crystals);
			})
        	this.setState({ crystal_plates })
     	});
	}

	addStatus(crystals){
		let used = 0;
		let accepted = 0;
		crystals.forEach(c=>{
			if (!c.status) {
				if (c.lab_data){
					c.status = "used";
					used ++;
				}
				else {
					c.status = "accepted";
					accepted ++;
				}
			}
		});
		this.updateUsed(used);
		this.updateAccepted(accepted);
		return crystals;
	}

	updateAccepted(int){
		this.setState({accepted: this.state.accepted + int});
	}

	updateRejected(int){
		this.setState({rejected: this.state.rejected + int});
	}

	updateUsed(int){
		this.setState({used: this.state.used + int});
	}
	
	changeScore(plate_id, well, score){
		let platesCopy = deepCopyObjectArray(this.state.crystal_plates);
		for (let i = 0; i < platesCopy.length; i++) {
			if(platesCopy[i].id === plate_id){
				const crystal = platesCopy[i].crystals.find(crystal => crystal.well === well);
				console.log(crystal.well, crystal.score)
				crystal.score = score;
				break;
			}
		}
		this.setState({crystal_plates: platesCopy});
	}
	
	changeCrystalAttribute(plate_id, well, attribute, value){
		console.log('fired changeCrystalAttribute', plate_id, well, attribute, value)
		let platesCopy = deepCopyObjectArray(this.state.crystal_plates);
		for (let i = 0; i < platesCopy.length; i++) {
			console.log(i)
			console.log('plate id: ', platesCopy[i].id )
			if(platesCopy[i].id === plate_id){
				const crystal = platesCopy[i].crystals.find(crystal => crystal.well === well);
				console.log(crystal.well)
				crystal[attribute] = value;
				break;
			}
		}
		this.setState({crystal_plates: platesCopy});
	}

	filterByScore(rejectLimit, acceptLimit, rejectScore, acceptScore){
		if(rejectLimit){
			this.setStatusByScore(rejectLimit, "rejected");
		}
		if(acceptLimit){
			this.setStatusByScore(acceptLimit, "accepted");
		}
		if(rejectScore){
			this.setStatusByScore(rejectScore, "rejected");
		}
		if(acceptScore){
			this.setStatusByScore(acceptScore, "accepted");
		}
	}

	setStatusByScore(score, status){
		let count = 0;

		this.state.crystal_plates.forEach(plate => {
			for (let i = 0; i < plate.crystals.length; i++) {
				if (plate.crystals[i].status === 'used') {
					continue;
				}
				if (this.updateStatus(plate.crystals[i], score, status)){
					count ++;
				}
			}
		});

		console.log('count: ', count)
		if (status === "rejected"){
			this.updateRejected(count);
			this.updateAccepted(-count);
		}
		else{
			this.updateAccepted(count);
			this.updateRejected(-count);
		}
	}

	updateStatus(crystal, score, status){
		console.log('updateStatus: ', crystal, score, status)
		if (isNaN(parseInt(score)) && crystal.score === score){
			console.log('Nan score')
			return changeAndTrack(crystal, "status", status);
		}
		console.log('number score')
		if (status==="rejected" && crystal.score < score){
			console.log('not enough')
			return changeAndTrack(crystal, "status", status);
		}
		else if (status === "accepted" && crystal.score > score){
			console.log('good enough')
			return changeAndTrack(crystal, "status", status);
		}
		else {
			console.log('nothing to change')
			return false;
		}
	}

	render() {
		 let output = [];
		 try {
			this.state.crystal_plates.forEach(plate => {
				output.push( <Plate 
				plate={plate}
				key={plate.name}
				updateAccepted={this.updateAccepted}
				updateRejected={this.updateRejected}
				updateUsed={this.updateUsed}
				loadData = {this.loadData}
				//changeScore = {this.changeScore}
				changeCrystalAttribute = {this.changeCrystalAttribute}
				/>
				);
			});
		}
		catch(TypeError){
			output = [];
		}
		return (
		<div id="crystals">
			<h1>Crystal gallery</h1>
			<main>
				<Sidebar 
					plates={this.state.crystal_plates} 
					visit={this.props.visit} 
					filterByScore={this.filterByScore}
					accepted = {this.state.accepted}
					rejected = {this.state.rejected}
					used = {this.state.used}
					/>
				<div id="crystal-plates">
					{output}
				</div>

				
			</main>
		</div>
	); 
}

}

export default Crystals;

//				<Main plates={this.state.crystal_plates} handleAccept={this.handleAccept} handleReject={this.handleReject} test={this.state.test} />
