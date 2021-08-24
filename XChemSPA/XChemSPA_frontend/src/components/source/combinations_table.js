import React, {Component} from 'react';
import { cocktailLibsMixin } from '../reusable_components/cocktail_libs_mixin';

class CombinationsTable extends cocktailLibsMixin(Component){
    processCocktails(){
        const libs = this.getLibrariesInCombinations(this.props.combinations.compounds);
		let nameStr = "";
		let plateStr = "";
        if (libs.names && libs.plates){
		    libs.names.forEach(lib => nameStr = nameStr + lib + ', ');
		    libs.plates.forEach(plate => plateStr = plateStr + plate + ', ');
		    return {names: nameStr, plates: plateStr};
        }
        else {
            return {names: null, plates: null};
        }

    }

    render(){
        const libraryCell = this.getLibraryCell();
        const libraryPlateCell = this.getPlateCell();
        return (
            <div>
                <h2>Compound combinations / "cocktails"</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Libraries</th>
                            <th>Library plates</th>
                            <th>Unused combinations</th>
                            <th>Used combinations</th>
                            <th>Show/hide details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {libraryCell}
                            {libraryPlateCell}
                            <td>{this.props.combinations.unused}</td>
                            <td>{this.props.combinations.used}</td>
                            <td>TODO</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
    
}

export default CombinationsTable;