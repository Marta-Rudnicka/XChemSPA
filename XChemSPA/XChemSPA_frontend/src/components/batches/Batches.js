import React, { Component, useLayoutEffect } from 'react';
import Sidebar from './sidebar/sidebar.js';
import NewBatches from './new-batches/newBatches';
import LibraryPlates from './sidebar/library_plates.js';
import CrystalPlates from './sidebar/crystal_plates.js';
import BatchForm from './new-batches/batch_form.js';
import Combinations from './sidebar/combinations.js';
import ExistingBatches from './old-batches/existing_batches.js';
import { groupCompoundsByPlate} from '../reusable_components/functions.js';
import axios from 'axios';
import Plate from './data-classes/Plate.js';
import UnmatchedPlates from './new-batches/unmatched_plates.js';
import Match from './new-batches/match.js'
import { JSON_CSRF } from '../reusable_components/csrf.js'

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
		this.saveBatches = this.saveBatches.bind(this);

		this.state={
			asideClass: 'collapsed',
			existingBatches: [],
			libraryPlates: null,
			crystalPlates: null,
			combinations: [],
			singleSoak: true,
			matches: [],
			batchSize : 0,
			batchStart: 1,
		}
	}
	
	//DOWNLOAD AND SORT OUT THE INITIAL DATA
	componentDidMount(){
		this.props.switchActive("batches");
		this.loadCompounds();
		this.loadCrystals();
		this.loadExistingBatches();
		this.loadCombinations();
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
		
		const apiUrl = '/api/batches/' + this.props.proposal + '/';
		axios.get(apiUrl)
		  .then(res => {
		   const existingBatches = res.data;
		   this.setState({ existingBatches: existingBatches, batchStart: existingBatches.length + 1 });
		 });
	}
	
	loadCombinations(){
		const apiUrl = '/api/combinations/' + this.props.visit + '/';

		axios.get(apiUrl)
		  .then(res => {
		   const combinations = res.data;
		   this.setState({ combinations });
		   this.processCombinations(combinations);
		 });
	}

	componentDidUpdate(prevProps, prevState){
        if(prevState !== this.state){
			this.checkDataIntegrity();
			//for debugging
        }
		if(prevState.combinations === null && this.state.combinations){
			this.processCombinations(this.state.combinations);
		}
		if(prevState.libraryPlates === null && this.state.libraryPlates){
			this.processCombinations(this.state.combinations);
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
	
	processCombinations(combinations){
		if (combinations.length === 0 || !this.state.libraryPlates){
			return;
		}

		let combinationsCollection = {library_name : "Compound combinations", library_plate : "", compounds : combinations, id : 99}
		let unused = 0;
		let used = 0;
		combinationsCollection.compounds.forEach(comb => {
			//combinationCount ++;
			if (comb.lab_data.length === 0){
				comb.status = "unused";
				unused ++;
			}
			else {
				comb.status = "used";
				used ++;
			}
			comb.compounds.forEach(c => {
				//compoundCount ++;
				this.markCompoundAsCombined(c);
			});
		});
		
		combinationsCollection.unused = unused;
		combinationsCollection.used = used;

		let platesCopy = [];
		this.state.libraryPlates.forEach(plate=> platesCopy.push(plate.copySelf()));
		platesCopy.push(new Plate(combinationsCollection, true))

		this.setState({libraryPlates : platesCopy});
	}
	
	markCompoundAsCombined(compound){
		this.state.libraryPlates.forEach(plate => { 
			if (plate.library_name === compound.library_name && plate.name === compound.library_plate){
				let found = plate.items.find( c => compound.code === c.code);
				if (found){
					found.status = "combined";
					plate.excludeItems(1) ;
				}
			}
		});	
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
		matchesCopy.forEach(match => this.recalculateMatch(match))
		return matchesCopy;
	}

	//MANAGE DATA MODEL AFTER CHANGING STATE
	recalculateMatch(match){
		//re-allocate items after deleting a match
		if (match.size === 0){
			return;
		}
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
		let i = this.state.batchStart;
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

	//SUBMIT DATA TO API

	saveBatches(){
		let token = [JSON_CSRF()]
		let batches = []

		this.state.matches.forEach(match =>{
			match.batches.forEach(batch => {
				batches.push(this.prepareBatchData(batch));
				//this.createLabObjsInAPI(batch);
			});
		});

		let data = new FormData(); 
		data.append("csrfmiddlewaretoken", token);
		data.append("batches", JSON.stringify(batches));
		data.append("visit", this.props.visit)

		const url = '/create-batches/'
		axios.post(url, data);
	}

	prepareBatchData(batch){
		let crystalIds = [];
		batch.crystals.forEach(crystal => crystalIds.push(crystal.id));
		let compoundIds = [];
		batch.compounds.forEach(compound => compoundIds.push(compound.id));
		let cocktail = false;
		if (batch.compounds[0].related_crystals !== undefined){
			cocktail = true;
		}
		const batchObj = {batchNumber: batch.batchNumber, crystalPlate : batch.crystalPlate.id, crystals : crystalIds, compounds : compoundIds, cocktail: cocktail}
		//TODO: sent to create endpoint
		//console.log('batch: ', batchObj);
		return batchObj;
	}

	//ENSURE DATA MAKES SENSE
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
		//console.log('matchedCrystals: ', matchedCrystals, 'matchedCompounds: ', matchedCompounds, 'matches: ', matchedInMatches);
		console.assert(matchedCompounds === matchedInMatches, 'matched compounds and matches not equal ');
		console.assert(matchedCrystals === matchedInMatches, 'matched crystals and matches not equal ');
	}

    render() {
		
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
					<LibraryPlates libraryPlates={this.state.libraryPlates} combinations={this.state.combinations}/>;
					{this.state.combinations.length > 0 ? <Combinations combinations={this.state.combinations} /> : null}
					<CrystalPlates 
						crystalPlates={this.state.crystalPlates} 
						resizeAndRefresh={this.resizeAndRefresh}
						resetAll={this.resetAll}
					/>
				</Sidebar>
				<main>
					<ExistingBatches batches={this.state.existingBatches}/>
					<BatchForm 
						changeSingleSoak={this.changeSingleSoak} 
						setBatchSize={this.setBatchSize}
						visit={this.props.visit}
					/>
					<NewBatches
						saveBatches = {this.saveBatches}
						>
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
