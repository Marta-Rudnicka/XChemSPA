//Data model for creating batches

export default class Batch {
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