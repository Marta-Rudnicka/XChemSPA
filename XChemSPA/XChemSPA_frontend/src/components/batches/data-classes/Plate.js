export default class Plate {
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
		console.log('useItems ', number, 'in ', this.library_name, this.name, this.matchedItems, '/', this.size)
		this.unmatchedItems = this.unmatchedItems - number;
		this.matchedItems = this.matchedItems + number;
		this.checkPlateIntegrity();
	}

	unmatchItems(number){
		console.log('unmatchItems ', number, 'in ', this.library_name, this.name, this.matchedItems, '/', this.size)
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
