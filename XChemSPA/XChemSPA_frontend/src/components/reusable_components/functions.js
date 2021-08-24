export function deepCopyObjectArray(array){
	//this sucks; needs to be changed
	//Only for JSON data -- DO NOT USE for objects with any methods
	let output = [];
	array.forEach(object => {
		const objectDeepCopy = JSON.parse(JSON.stringify(object));
		output.push(objectDeepCopy);
	});
	return output;
}

export function removeFromArray(array, elements_to_remove){
	/**Takes in two arrays, <array> and <elements_to_remove>; returns a copy
	 * of <array> without items from  <elements_to_remove>
	 */
	const arrayCopy = array.slice(0, array.length);
	elements_to_remove.forEach(element => {
		if (arrayCopy.includes(element)){
			const found = arrayCopy.find(item => item === element);
			arrayCopy.splice(arrayCopy.indexOf(found), 1);
		}
	});
	return arrayCopy;
}

export function changeAndTrack(object, attribute, value){
	/**Changes <object>'s <attribute> to <value> unless it is already equal to <value>.
	 * If a change was made, returns true, otherwise returns false.
	 */
	if (object[attribute] === value){
		return false;
	}
	else{
		object[attribute] = value
		return true;
	}
}


export function groupCompoundsByPlate(compounds_array){
	let plates = {};
	let plates_with_compounds = [];

	compounds_array.forEach(c => {
	  plates[c.library_plate] = c.library_name
	});
	let i = 0;
	for (const [key, value] of Object.entries(plates)) {
	  let newPlate = {id: i, library_plate: key, library_name: value, used: 0, unused: 0};
	  let c = compounds_array.filter(compound => compound.library_name === newPlate.library_name && compound.library_plate === newPlate.library_plate);
	  c.forEach(compound =>{
		if (compound.lab_data.length > 0){
		  compound.status = "used";
		  newPlate.used ++;
		}
		else{
		  compound.status = "unused";
		  newPlate.unused ++;
		}
		
	  });
	  newPlate.compounds = c;
	  plates_with_compounds.push(newPlate)
	  i++;
	};
	return plates_with_compounds;
  }

export function addStatusToItems(collection, key){
	console.log('placeholder');
}

export function groupCompoundsIntoCombinations(combinations, plates){
	console.log('fired groupCompoundsIntoCombinations');
	if (!combinations || !plates || combinations.length === 0 || plates.length === 0){
		console.log('groupCompoundsIntoCombinations: early return');
		return;
	}
	console.log('start grouping')
	combinations.forEach(comb => {
		comb.compounds.forEach(c => {
			console.log('marking: ', c);
			markCompoundAsCombined(c, plates);
		});
	});
	return plates;
}

function markCompoundAsCombined(compound, libraryPlates){
	console.log('fired markCompoundAsCombined for', compound)
	libraryPlates.forEach(plate => {
		console.log('checking: ', plate.library_name, plate.library_plate)
		if (plate.library_name === compound.library_name && plate.library_plate === compound.library_plate){
			let found = plate.compounds.find( c => compound.code === c.code);
			console.log('found combined compound')
			found.status = "combined";
		}
	});	
}


export function leadingZero(string){
	if (string.length === 1){
		return '0' + string;
	}
	else {
		return string;
	}
}
