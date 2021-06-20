import React, { Component, useLayoutEffect } from 'react';
import Sidebar from './sidebar/sidebar.js';
import NewBatches from './new-batches/newBatches';
import LibraryPlates from './sidebar/library_plates.js';
import CrystalPlates from './sidebar/crystal_plates.js';
import BatchForm from './new-batches/batch_form.js';
import Combinations from './combinations.js';
import {combinations} from './fake_data.js';
import ExistingBatches from './old-batches/existing_batches.js';
import { groupCompoundsByPlate} from '../reusable_components/functions.js';
import axios from 'axios';
import Plate from './data-classes/Plate.js';
import UnmatchedPlates from './new-batches/unmatched_plates.js';
import Match from './new-batches/match.js'

class Batches extends Component {
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

	deleteEmptyMatch(matchesCopy){
		let prevSize = matchesCopy.length;
		matchesCopy = matchesCopy.filter(match => match.crystalPlate !== null || match.libraryPlate !== null);
		if (matchesCopy.length === prevSize){
			return matchesCopy;
		}
		console.log('deleted empty matches')
		matchesCopy.forEach(match => this.recalculateMatch(match))
		return matchesCopy;
	}

	recalculateMatch(match){
		//re-allocate items after deleting a match
		console.log('firing recalculateMatch on match: ', match.size, match.libraryPlate, match.crystalPlate)
		if (match.size === 0){
			return;
		}
		console.log('running recalculateMatch: (lib, cryst): ', match.libraryPlate.name, match.crystalPlate.name)
		console.log('running recalculateMatch: (lib.unmatched, cryst.unmatched): ', match.libraryPlate.unmatchedItems, match.crystalPlate.unmatchedItems)
		const leftInLP = match.libraryPlate.unmatchedItems;
		const leftInCP = match.crystalPlate.unmatchedItems
		if (leftInLP > 0 && leftInCP > 0 ){
			const extra = Math.min(leftInLP, leftInCP);
			match.addItems(extra);
			match.libraryPlate.useItems(extra);
			match.crystalPlate.useItems(extra);

			this.reNumberBatchesWrapper();
		}
	}

	reNumberBatches(matchArray){
		matchArray = this.deleteEmptyMatch(matchArray);
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
		if (this.state.matches.length > 0)
			if (this.state.matches.length === 0) {
				return;
			}
		let matchesCopy = [];
		this.state.matches.forEach(match=> matchesCopy.push(match.copySelf()));
		matchesCopy = this.reNumberBatches(matchesCopy);
		this.setState({matches: matchesCopy});
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
			//match.reset();
		});

		//this.deleteEmptyMatch();
		this.setState({matches : []});
	}

	checkDataIntegrity(){
		if (!this.state.libraryPlates || !this.state.crystalPlates){
			return;
		}
		if (this.state.matches === []){
			if(this.state.libraryPlates)
			this.state.libraryPlates.forEach(plate => {
				console.assert(plate.matchedItems === 0, 'leftover matched items in %s', plate.name);
			});
			
			if(this.state.crystalPlates){
				this.state.crystalPlates.forEach(plate => {
					console.assert(plate.matchedItems === 0, 'leftover matched items in %s', plate.name);
				});
			}
		}

		let matchedCrystals = 0;
		let matchedCompounds = 0;
		let matchedInMatches = 0;
		this.state.matches.forEach(match => matchedInMatches = matchedInMatches + match.size);
		this.state.crystalPlates.forEach(plate => matchedCrystals = matchedCrystals + plate.matchedItems);
		this.state.libraryPlates.forEach(plate => matchedCompounds = matchedCompounds + plate.matchedItems);
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
