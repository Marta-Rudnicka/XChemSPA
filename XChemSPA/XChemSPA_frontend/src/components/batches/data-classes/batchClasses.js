//Data model for creating batches

export class Plate {
	constructor(plate, isLibPlate){

		//for cloning Plates
		if (plate instanceof Plate){ 
			this.id = plate.id
			this.name = plate.name;
			this.items = plate.items;
			this.size = plate.size;
			this.unmatchedItems = plate.unmatchedItems;		
			this.matchedItems = plate.matchedItems;					
			this.originalSize = plate.originalSize;          
        	this.isLibPlate = isLibPlate;
			this.used = plate.used;
			this.usedItems = plate.usedItems;
			
			this.library_name = plate.library_name;
			this.selected = plate.selected;
			     
			this.excluded = plate.excluded;
			
		}

		//for creating Plates based on JSON objects from the API
        else {
			if(isLibPlate){   
				this.library_name = plate.library_name 
				this.name = plate.library_plate;
				this.items = plate.compounds;
				this.selected = plate.unused + plate.used;
			}
				
			else {
				this.name = plate.name;
				this.items = plate.crystals;
				this.excluded = plate.excluded;
			}

			this.used = plate.used;
			this.size = plate.unused;
			this.id = plate.id;	
			this.unmatchedItems = this.size;		
			this.matchedItems = 0;					
			this.originalSize = this.size;          
			this.isLibPlate = isLibPlate;
			this.sortItems();       
		}    
	}
	
	copySelf(){
		return new Plate(this, this.isLibPlate);
	}

	sortItems(){
		let unused = []
		let used = []
		this.items.forEach(item => {
			if (item.status === "used" || item.used === true){
				used.push(item)
			}
			else {
				unused.push(item)
			}
		});
		this.items = unused;
		this.usedItems = used;
	}

	useItems(number){
		this.unmatchedItems = this.unmatchedItems - number;
		this.matchedItems = this.matchedItems + number;
		this.checkPlateIntegrity();
	}

	unmatchItems(number){
		this.unmatchedItems = this.unmatchedItems + number;
		this.matchedItems = this.matchedItems - number;
		this.checkPlateIntegrity();
	}
	
	resize(newSize){
		if (this.originalSize < newSize ) {
			throw new RangeError("Trying to resize a crystallisation plate beyond its original size.");
		}

        if (this.isLibPlate){
            throw new TypeError("Trying to resize a library plate");
        }
		else {
			this.size = parseInt(newSize);
			this.unmatchedItems = parseInt(newSize);
			this.matchedItems = 0;
		}

		this.checkPlateIntegrity();
	}

	//for debugging
	checkPlateIntegrity() {
		if (this.size < 0 || this.unmatchedItems < 0 || this.matchedItems < 0 ) {
			throw new RangeError("Negative value(s) in a Plate object's properties; ", this);
		}
		
		if (this.unmatchedItems + this.matchedItems !== this.size) {
			throw new RangeError('Items in a Plate object do not add up: ', this);
		}
	}
}

export class Match {
	constructor(libraryPlate, crystalPlate, size, batchSize, compounds = [], crystals = [], batches = []){
		console.log('creating Match: ', libraryPlate, crystalPlate, size, batchSize)
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
		else {
			console.log('constructor for a clone')
		}
		console.log('this.size after constructor: ', this.size)
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
		console.log('adding items: ', int, this.libraryPlate.name)
		const items = this.getItemsList(int)
		console.log('items: ', items)
		this.compounds.push(...items.c);
		this.crystals.push(...items.x);
		console.log('this.compounds: ', this.compounds, 'this.crystals: ', this.crystals)
		this.remakeBatches();
		//this.checkIntegrity();
	}

	makeBatches(){
		console.log('firing makeBatches; this.size: ', this.size)
		if (this.size === 0 ){
			return; 					//nothing to do here
		}
		if (this.batchSize === 0){ 		// 1 batch per plate
			console.log('one batch per plate')
			const newBatch = new Batch(
				this.libraryPlate, 
				this.crystalPlate, 
				this.compounds, 
				this.crystals
			);
			this.batches.push(newBatch);
		}
		else{							//fixed batch size
			console.log('fixed batch size')
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
		console.log('this.size after making batches: ', this.size)
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

export class Batch {
	constructor(libraryPlate, crystalPlate, compounds, crystals){									
		this.libraryPlate = libraryPlate;					
		this.crystalPlate = crystalPlate;					
		this.batchNumber = null;							
		this.compounds = compounds;
		this.crystals = crystals;
		this.size = this.compounds.length;
		this.checkBatchIntegrity();						
												
	}
	
	checkBatchIntegrity() {
		if (this.size < 0 ) {
			throw new RangeError("Negative size of a Batch object; ", this);
		}
		
		if (this.compounds.length !== this.crystals.length) {
			throw new RangeError('Different number of crystals and compounds/combinations in a batch: ', this);
		}
		if (this.compounds.length !== this.size) {
			print('Error in ', this)
			throw new RangeError('Invalid batch size: ', this);
		}
	}
}