import React, { Component } from 'react';
import SelectLibraryPlate from './select_library_plate.js';
import SelectCrystalPlate from './select_crystal_plate.js';
import {Match} from './batchClasses.js'

export class UnmatchedPlates extends Component {
	constructor(props){
        super(props);

        this.selectLibPlate = this.selectLibPlate.bind(this);
        this.selectCrystalPlate = this.selectCrystalPlate.bind(this);
        this.state = {
            selectedLibPlate : null,
            selectedLibPlateId: "none",
            selectedCrystalPlate: null,
            selectedCrystalPlateId: "none"
        }
	}

    componentDidUpdate(prevProps, prevState){
        if(prevState !== this.state){
            if (this.state.selectedLibPlate !== null && this.state.selectedCrystalPlate !==null){
                this.createMatch();
                this.reset();
            }
        }
    }

    reset(){
        this.setState({
            selectedLibPlate : null,
            selectedLibPlateId: "none",
            selectedCrystalPlate: null,
            selectedCrystalPlateId: "none"
        })
    }

    createMatch(){
        const l = this.state.selectedLibPlate;
        const c = this.state.selectedCrystalPlate;
        const size = Math.min(l.unmatchedItems, c.unmatchedItems)
        const match = new Match(l, c, size, [], this.props.batchSize)
        l.useItems(size);
        c.useItems(size);
        this.props.addMatch(match);
    }

    selectLibPlate(e){
        //const id = e.target.value;
        const id = e;
        if (id==="none"){
            this.setState({selectedLibPlate: null, selectedLibPlateId : "none"});
            return;
        }
        const libPlate = this.props.libraryPlates.find(plate => plate.id === parseInt(id));
        this.setState({selectedLibPlate: libPlate, selectedLibPlateId : id});
    }

    selectCrystalPlate(e){
        //const id = e.target.value;
        const id = e;
        if (id==="none"){
            this.setState({selectedCrystalPlate : null, selectedCrystalPlateId : "none"});
            return;
        }
        const crystalPlate = this.props.crystalPlates.find(plate => plate.id === parseInt(id));
        this.setState({selectedCrystalPlate: crystalPlate, selectedCrystalPlateId : id});
    }

    getDropsLeft(){
        let crystalsLeft = 0;
        let compoundsLeft = 0;
        try{
            this.props.libraryPlates.forEach(plate => compoundsLeft = compoundsLeft + plate.unmatchedItems);
            this.props.crystalPlates.forEach(plate => crystalsLeft = crystalsLeft + plate.unmatchedItems);
        }
        catch(TypeError){
            return 0;
        }    
        return Math.min(crystalsLeft, compoundsLeft);
    }

	render() {
        let libraryPlates = [];
        let crystalPlates = [];
        if (this.props.libraryPlates && this.props.crystalPlates) {
            libraryPlates = this.props.libraryPlates.filter(plate => plate.unmatchedItems > 0);
	    	crystalPlates = this.props.crystalPlates.filter(plate => plate.unmatchedItems > 0);
        }
        const libValue = this.state.selectedLibPlateId;
        const crystValue = this.state.selectedCrystalPlateId;
        const dropsLeft = this.getDropsLeft();

        return (
    			<tr className="batch-row">
					<td className="lib-plate" rowSpan="1">
						<SelectLibraryPlate
                            id = "new-lib" 
                            plates={libraryPlates} 
                            handleChange={this.selectLibPlate}
                            value={libValue}
                            />
                        <span className="items-left"> {
                            this.state.selectedLibPlate ? 
                            this.state.selectedLibPlate.unmatchedItems + " compounds left" :
                            null
                            }
                        </span>
					</td>
					<td className="cr-plate">
						<SelectCrystalPlate 
                            id = "new-lib"
                            plates={crystalPlates}
                            handleChange={this.selectCrystalPlate}
                            value={crystValue}
                        />
                        <span className="items-left">{
                            this.state.selectedCrystalPlate ? 
                            this.state.selectedCrystalPlate.unmatchedItems + " crystals left" :
                            null
                            }
                        </span>
					</td>
                    <td>{dropsLeft} drops left</td>		
					
				</tr>
        );
    }
}

export default UnmatchedPlates;