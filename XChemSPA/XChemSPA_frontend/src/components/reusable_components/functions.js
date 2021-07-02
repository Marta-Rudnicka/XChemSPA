export function deepCopyObjectArray(array){
	//this sucks; needs to be changed
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
		const found = arrayCopy.find(item => item === element);
		arrayCopy.splice(arrayCopy.indexOf(found), 1);
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
	console.log('plateholder');
}