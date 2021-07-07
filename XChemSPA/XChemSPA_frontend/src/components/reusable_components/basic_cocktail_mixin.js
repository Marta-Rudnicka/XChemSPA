import React from 'react';
import BatchDetailsBySoak from '../batches/old-batches/batch_details_by_soak.js';
import BatchDetailsCocktail from '../batches/old-batches/batch_details_cocktail.js';

export function basicCocktailMixin(component) {

	return class basicCocktailMixinClass extends component {

		//display details in two ways
		getChangeView(){
			return (
				<div>
					<input type="checkbox" onChange={event => this.handleCheckbox(event)} className={this.state.hideClass} />
					<label className={this.state.hideClass}>view by soak</label>
				</div> 
			);
		}

		getBatchDetails(){
			if (this.state.detailsBySoak)
				return <BatchDetailsBySoak crystals={this.props.batch.crystals} />
			else {
				return <BatchDetailsCocktail crystals={this.props.batch.crystals} />
			}
		}

		handleCheckbox(event){
			if (event.target.checked){
				this.setState({detailsBySoak: true});
			}
			else {
				this.setState({detailsBySoak: false});
			}
		}

		//name libraries and plates in the batch
		getLibraryCell(){
			return <td>{this.getLibrariesInCombinations()['libraries']}</td>;
		}
		
		getPlateCell(){
			return <td>{this.getLibrariesInCombinations()['plates']}</td>;
		}


		getLibrariesInCombinations(){
			let libraries = [];
			let plates = [];

			this.props.batch.crystals.forEach(crystal => {
				crystal.compound_combination.compounds.forEach(compound=>{
					if (!libraries.includes(compound.library_name)){
						libraries.push(compound.library_name)
					}
					if (!plates.includes(compound.library_plate)){
						plates.push(compound.library_plate)
					}
				})
			})
			let libraryStr = "";
			let plateStr = "";
			libraries.forEach(lib => libraryStr = libraryStr + lib + ', ');
			plates.forEach(plate => plateStr = plateStr + plate + ', ');
			return {libraries: libraryStr, plates: plateStr};
		}    
	}
}