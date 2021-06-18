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
		}    
	}
	
	copySelf(){
		return new Plate(this, this.isLibPlate);
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
	constructor(libraryPlate, crystalPlate, size, batches, batchSize){
		this.libraryPlate = libraryPlate;
		this.crystalPlate = crystalPlate;
		this.size = size;
		this.batches = batches;
		this.batchSize = batchSize;
		if (this.batches.length === 0){
			this.makeBatches();
		}
	}

	resetLibraryPlate(){
		this.libraryPlate = null;
		this.size = 0;
		this.batches = [];
		this.checkIntegrity();
	}
	resetCrystalPlate(){
		this.crystalPlate = null;
		this.size = 0;
		this.batches = [];
		this.checkIntegrity();
	}

	reset(){
		this.libraryPlate = null;
		this.crystalPlate = null;
		this.size = 0;
		this.batches = [];
	}
	copySelf(){
		return new Match(this.libraryPlate, this.crystalPlate, this.size, this.batches, this.batchSize);
	}

	addItems(int){
		this.size = this.size + int;
		this.remakeBatches();
		this.checkIntegrity();
	}

	makeBatches(){
		if (this.size === 0 ){
			return; 					//nothing to do here
		}
		if (this.batchSize === 0){ 		// 1 batch per plate
			const newBatch = new Batch(this.size, this.libraryPlate, this.crystalPlate);
			this.batches.push(newBatch);
		}
		else{							//fixed batch size
			for(let i = this.size ; i > 0 ; i = i - this.batchSize){
				if (i >= this.batchSize){
					const newBatch = new Batch(this.batchSize, this.libraryPlate, this.crystalPlate);
					this.batches.push(newBatch);
				}
				else {
					const newBatch = new Batch(i, this.libraryPlate, this.crystalPlate);
					this.batches.push(newBatch);
				}
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

export class Batch {
	constructor(size, libraryPlate, crystalPlate){
		this.size = size;									
		this.libraryPlate = libraryPlate;					
		this.crystalPlate = crystalPlate;					
		this.batchNumber = null;							
		
		//this.wells = [];									
		//this.drops = [];										
	}
	
	checkBatchIntegrity() {
		if (this.size < 0 ) {
			throw new RangeError("Negative size of a Batch object; ", this);
		}
		
		if (this.libPlate && (this.size > this.libPlate.size) ) {
			
			throw new RangeError('Batch object has more items than its libPlate: ', this);
		}
		
		if (this.crystalPlate && (this.size > this.crystalPlate.size) ) {
			throw new RangeError('Batch object has more items than its crystalPlate: ', this);
		}
	}
}