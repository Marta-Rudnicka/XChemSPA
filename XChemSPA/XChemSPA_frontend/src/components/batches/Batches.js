import React, { Component, useLayoutEffect } from 'react';
import Sidebar from './sidebar.js';
import NewBatches from './newBatches';
import LibraryPlates from './library_plates.js';
import CrystalPlates from './crystal_plates.js';
import BatchForm from './batch_form.js';
import Combinations from './combinations.js';
import {combinations} from './fake_data.js';
import ExistingBatches from './existing_batches.js';
import { groupCompoundsByPlate} from '../reusable_components/functions.js';
import axios from 'axios';
import {Plate} from './batchClasses';
import UnmatchedPlates from './unmatched_plates.js';
import Match from './match.js'

export class Batches extends Component {
	constructor(props){
		super(props);

		this.hideSidebar = this.hideSidebar.bind(this);
		this.showSidebar = this.showSidebar.bind(this);
		this.changeSingleSoak = this.changeSingleSoak.bind(this);
		this.addMatch = this.addMatch.bind(this);
		this.deleteEmptyMatch = this.deleteEmptyMatch.bind(this);
		this.setBatchSize = this.setBatchSize.bind(this);
		this.reNumberBatchesWrapper = this.reNumberBatchesWrapper.bind(this);
		this.resizeAndRefresh = this.resizeAndRefresh.bind(this);
		this.resetAll = this.resetAll.bind(this);

		this.state={
			asideClass: 'collapsed',
			libraryPlates: null,
			crystalPlates: null,
			combinations: combinations,
			singleSoak: true,
			matches: [],
			batchSize : 0,
		}
	}
	
	//DOWNLOAD AND SORT OUT THE INITIAL DATA
	componentDidMount(){
		this.props.switchActive("batches");
		this.loadCompounds();
		this.loadCrystals();
	}
	
	loadCompounds(){
		const apiUrl = '/api/source_compounds/' + this.props.proposal + '/';

		axios.get(apiUrl)
		  .then(res => {
		   const compounds = res.data;
		   let libraryPlates = this.createLibraryPlateObjects(compounds);
		   this.setState({ libraryPlates });
		 });
	}

	loadCrystals(){
		const apiUrl = '/api/crystal_plates/' + this.props.proposal + '/';
		axios.get(apiUrl)
		.then(res => {
			let crystalPlates = res.data;
			crystalPlates.forEach(plate => {
				this.addStatus(plate, "crystals","lab_data");
				plate.excluded = 0;
			})
			crystalPlates = this.createCrystalPlateObjects(crystalPlates);
			this.setState({ crystalPlates });
		});
	}

	loadExistingBatches(){
		console.log('loading existing baches')
	}

	componentDidUpdate(prevProps, prevState){
        if(prevState !== this.state){
			this.checkDataIntegrity();
        }
    }

	addStatus(plate, items, key){
		let used = 0;
		let unused = 0;
		plate[items].forEach(item=>{
			if (item[key]){
				item.status = "used";
				used ++;
			}
			else {
				item.status = "unused";
				unused ++;
			}
		});
		plate.used = used;
		plate.unused = unused;
		return plate;
	}

	createLibraryPlateObjects(compounds){
		let plates =  groupCompoundsByPlate(compounds);
		plates = this.createPlateObjects(plates, true);
		return plates;
	}

	createCrystalPlateObjects(plates){
		return this.createPlateObjects(plates, false)
	}

	createPlateObjects(plates, isLibPlate){
		let newPlates = [];
		plates.forEach(plate => {
			const p = new Plate(plate, isLibPlate)
			newPlates.push(p);
		});
		return newPlates;
	}

	//MANAGE DISPLAY
	showSidebar(){
		this.setState({asideClass: 'show'})
	}
	
	hideSidebar(){
		this.setState({asideClass: 'collapsed'})
	}
	
	//MANAGE STATE
	changeSingleSoak(bool){
		this.setState({singleSoak: bool});
	}
	
	setBatchSize(int){
		this.setState({batchSize: int});
		let matchesCopy = [];
		this.state.matches.forEach(match=> matchesCopy.push(match.copySelf()));
		matchesCopy.forEach(match => match.resetBatchSize(int))
		matchesCopy = this.reNumberBatches(matchesCopy);
		this.setState({matches : matchesCopy});
	}

	addMatch(newMatch){
		let matchesCopy = [];
		this.state.matches.forEach(match => matchesCopy.push(match.copySelf()));
		matchesCopy.push(newMatch);
		matchesCopy = this.reNumberBatches(matchesCopy);
		this.setState({matches: matchesCopy});	
	}

	deleteEmptyMatch(){
		let matchesCopy = [];
		this.state.matches.forEach(match=> matchesCopy.push(match.copySelf()));
		matchesCopy = matchesCopy.filter(match => match.crystalPlate !== null && match.libraryPlate !== null);
		matchesCopy.forEach(match => this.recalculateMatch(match))
		matchesCopy = this.reNumberBatches(matchesCopy);
		this.setState({matches: matchesCopy});
	}

	recalculateMatch(match){
		//re-allocate items after deleting a match
		const leftInLP = match.libraryPlate.unmatchedItems;
		const leftInCP = match.crystalPlate.unmatchedItems
		if (leftInLP > 0 && leftInCP > 0 ){
			const extra = Math.min(leftInLP, leftInCP);
			match.libraryPlate.useItems(extra);
			match.crystalPlate.useItems(extra);
			match.addItems(extra);
			this.reNumberBatchesWrapper();
		}
	}

	reNumberBatches(matchArray){
		let i = 1;
		matchArray.forEach(match => {
			match.batches.forEach(batch => {
				batch.batchNumber = i;
				i++;
			});
		});
		return matchArray;
	}

	reNumberBatchesWrapper(){
		//for methods that do not otherwise process on a copy if this.state.matches
		try {
			if (this.state.matches.length === 0) {
				return;
			}
			let matchesCopy = [];
			this.state.matches.forEach(match=> matchesCopy.push(match.copySelf()));
			matchesCopy = this.reNumberBatches(matchesCopy);
			this.setState({matches: matchesCopy});
		}
		catch(TypeError){
			//not loaded yet
		}
	}

	resizeAndRefresh(plate_id, newSize){
		let crystalPlatesCopy = [];
		this.state.crystalPlates.forEach(plate=> crystalPlatesCopy.push(plate.copySelf()));
		let mod = crystalPlatesCopy.find(plate => plate.id === plate_id)
		mod.resize(newSize);
		this.setState({crystalPlates : crystalPlatesCopy});
	}

	resetAll(){
		this.state.matches.forEach(match => {
			match.libraryPlate.unmatchItems(match.size);
			match.crystalPlate.unmatchItems(match.size);
			match.reset();
		});

		this.deleteEmptyMatch();
	}

	checkDataIntegrity(){
		if (this.state.matches === []){
			try {
				this.state.libraryPlates.forEach(plate => {
					console.assert(plate.matchedItems === 0, 'leftover matched items in %s', plate.name);
				})
			}
			catch(TypeError){
				console.assert(this.state.libraryPlates === null, 'inavlid value for this.state.libraryPlates')
			}
			try {
				this.state.crystalPlates.forEach(plate => {
					console.assert(plate.matchedItems === 0, 'leftover matched items in %s', plate.name);
				})
			}
			catch(TypeError){
				console.assert(this.state.crystalPlates === null, 'inavlid value for this.state.libraryPlates')
			}
		}

		let matchedCrystals = 0;
		let matchedCompounds = 0;
		let matchedInMatches = 0;
		this.state.matches.forEach(match => matchedInMatches = matchedInMatches + match.size);
		try {
			this.state.crystalPlates.forEach(plate => matchedCrystals = matchedCrystals + plate.matchedItems);
			this.state.libraryPlates.forEach(plate => matchedCompounds = matchedCompounds + plate.matchedItems);
		}
		catch(TypeError){
			console.assert((this.state.crystalPlates === null || this.state.libraryPlates === null), 'invalid plates')
		}	
		console.assert(matchedCrystals === matchedCompounds, 'matched crystals and compounds not equal',);
		console.assert(matchedCompounds === matchedInMatches, 'matched compounds and matches not equal ');
		console.assert(matchedCrystals === matchedInMatches, 'matched crystals and matches not equal ');
	}

    render() {
		
		const source = this.state.singleSoak ? 
			<LibraryPlates libraryPlates={this.state.libraryPlates}/> : 
			<Combinations combinations={this.state.combinations} />;
		
			let matches = [];
		
			if (this.state.matches){
			matches = this.state.matches.map((match, index) => {
				return <Match 
					key={index} 
					match={match} 
					libraryPlates={this.state.libraryPlates} 
					crystalPlates={this.state.crystalPlates} 
					deleteEmptyMatch = {this.deleteEmptyMatch}
					reNumberBatches = {this.reNumberBatchesWrapper}
					/>
			});
		}
        return (
            <div id="batches">
				<h1>Batches</h1>
				<Sidebar 
					asideClass = {this.state.asideClass}
					showSidebar = {this.showSidebar}
					hideSidebar = {this.hideSidebar}
				>
					{source}
					<CrystalPlates 
						crystalPlates={this.state.crystalPlates} 
						resizeAndRefresh={this.resizeAndRefresh}
						resetAll={this.resetAll}
					/>
				</Sidebar>
				<main>
					<ExistingBatches />
					<BatchForm 
						changeSingleSoak={this.changeSingleSoak} 
						setBatchSize={this.setBatchSize} 
					/>
					<NewBatches>
						{matches}
						<UnmatchedPlates 
							libraryPlates = {this.state.libraryPlates}
							crystalPlates = {this.state.crystalPlates}
							batchSize = {this.state.batchSize}
							addMatch = {this.addMatch}
						/>
					</NewBatches>
				</main>
            </div>
        );
    }
}

export default Batches;
