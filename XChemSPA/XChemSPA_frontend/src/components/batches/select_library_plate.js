import SelectCrystalPlate from './select_crystal_plate.js';

export class SelectLibraryPlate extends SelectCrystalPlate {
	getNameString(plate){
		return plate.library_name + ': ' + plate.name;
	}
} 

export default SelectLibraryPlate
