import Batch from './Batch.js';

export default class Match {
	constructor(libraryPlate, crystalPlate, size, batchSize, compounds = [], crystals = [], batches = []){
		this.libraryPlate = libraryPlate;
		this.crystalPlate = crystalPlate;
		this.size = size;
		this.batches = batches;
		this.batchSize = batchSize;
		this.compounds = compounds;
		this.crystals = crystals;
		this.batches = batches;
		if (this.batches.length === 0){
			const items = this.getItemsList(this.size);
			this.compounds = items.c;
			this.crystals = items.x;
			this.makeBatches();
		}
	}

	resetLibraryPlate(){
		console.log('fired resetLibraryPlate')
		this.libraryPlate = null;
		this.empty();
		console.log(this.size)
		this.checkIntegrity();
	}
	resetCrystalPlate(){
		console.log('fired resetCrystalPlate')
		this.crystalPlate = null;
		this.empty();
		console.log(this.size)
		this.checkIntegrity();
	}

	getItemsList(number){
		console.log('fired getItemList', number)
		if (this.libraryPlate && this.libraryPlate.name){
			console.log(' in: ', this.libraryPlate.name);
		}
		if (this.size === 0){
			return {c : [], x : []}
		}

		let compounds = null;
		let crystals = null;
		const lp = this.libraryPlate;
		const cp = this.crystalPlate;
		console.log('lp.matchedItems: ', lp.matchedItems, 'cp.matchedItems: ', cp.matchedItems)
		compounds = lp.items.slice(lp.matchedItems, lp.matchedItems + number);
		crystals = cp.items.slice(cp.matchedItems, cp.matchedItems + number);
		console.log('this.size before exiting getItemsList', this.size)
		return {c : compounds, x: crystals};
	}

	reset(){
		this.libraryPlate = null;
		this.crystalPlate = null;
		this.empty();
	}

	empty(){
		this.size = 0;
		this.batches = [];
		this.crystals = [];
		this.compounds = [];
	}

	copySelf(){
		return new Match(
			this.libraryPlate, 
			this.crystalPlate, 
			this.size, 
			this.batchSize, 
			this.compounds, 
			this.crystals, 
			this.batches,
			);
	}

	addItems(int){
		this.size = this.size + int;
		console.log('adding items: ', int, this.libraryPlate.name)
		const items = this.getItemsList(int)
		this.compounds.push(...items.c);
		this.crystals.push(...items.x);
		this.remakeBatches();
		//this.checkIntegrity();
	}

	makeBatches(){
		//console.log('firing makeBatches; this.size: ', this.size)
		if (this.size === 0 ){
			return; 					//nothing to do here
		}
		if (this.batchSize === 0){ 		// 1 batch per plate
			//console.log('one batch per plate')
			const newBatch = new Batch(
				this.libraryPlate, 
				this.crystalPlate, 
				this.compounds, 
				this.crystals
			);
			this.batches.push(newBatch);
		}
		else{							//fixed batch size
			//console.log('fixed batch size')
			for(let i = 0 ; i < this.size ; i = i + this.batchSize){
				const newBatch = new Batch(
					this.libraryPlate, 
					this.crystalPlate,
					this.compounds.slice(i, i + this.batchSize),
					this.crystals.slice(i, i + this.batchSize)
				);
				this.batches.push(newBatch);
			}

		}
		this.checkIntegrity();
	}

	remakeBatches(){
		this.batches = [];
		this.makeBatches();
	}

	resetBatchSize(int){
		this.batchSize = int;
		this.remakeBatches();
	}

	checkIntegrity(){
		if ( (this.libraryPlate === null || this.crystalPlate === null) && ( this.size > 0 || this.batches.length > 0 )){
			throw new RangeError('Match not empty despite missing a plate', this);
		}
		
		let batchSum = 0;
		this.batches.forEach(batch => batchSum = batchSum + batch.size);
		if (batchSum !== this.size){
			throw new RangeError('Batches do not add up', this);
		}
	}
}