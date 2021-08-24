import React from 'react';

export function cocktailLibsMixin(component) {

	return class CocktailLibsMixinClass extends component {

		//name libraries and plates in the batch
		getLibraryCell(){
			return <td>{this.processCocktails()['names']}</td>;
		}
		
		getPlateCell(){
			return <td>{this.processCocktails()['plates']}</td>;
		}

		getLibrariesInCombinations(cocktails){
            if (!cocktails){
                return {names: null, plates: null}
            }
            console.log('getLibrariesInCombinations', cocktails)
			let names = [];
			let plates = [];
			cocktails.forEach(cocktail => {
				cocktail.compounds.forEach(compound=>{
					if (!names.includes(compound.library_name)){
						names.push(compound.library_name)
					}
					if (!plates.includes(compound.library_plate)){
						plates.push(compound.library_plate)
					}
				});
			});

			return {names: names, plates: plates};
		}    
	}
}