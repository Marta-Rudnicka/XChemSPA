import React, { Component } from 'react';
import MainThead from './main_thead.js';
import SelectLibraryPlate from './select_library_plate.js';
import SelectCrystalPlate from './select_crystal_plate.js';

export class Match extends Component {
  constructor(props){
    super(props);

    this.changeCrystalPlate = this.changeCrystalPlate.bind(this);
    this.changeLibraryPlate = this.changeLibraryPlate.bind(this);
    this.state = {
      selectedLibPlateId: this.props.match.libraryPlate.id,
      selectedCrystalPlateId: this.props.match.crystalPlate.id,
      selectedLibPlate: this.props.match.libraryPlate,
      selectedCrystalPlate: this.props.match.crystalPlate,
    }
  }

  componentDidUpdate(prevProps, prevState){
    const s = this.state;
        if(prevState !== s && s.selectedLibPlate === null && s.selectedCrystalPlate === null ){
        	this.props.deleteEmptyMatch();
        }
    }
  
  resetMatch(){
    const match = this.props.match;
    try{
      match.libraryPlate.unmatchItems(match.size);
    }
    catch(TypeError){
      //match.libraryPlate might be null, in which case no action is required
    }
    try{
      match.crystalPlate.unmatchItems(match.size);
    }
    catch(TypeError){
      //same as above
    }
  }

  changeLibraryPlate(id){
    let match = this.props.match;
    this.resetMatch();
    match.resetLibraryPlate();
    this.setState({selectedLibPlateId : id});
    if (id !== "none"){
      const libPlate = this.props.libraryPlates.find(plate => plate.id === parseInt(id));
      const newSize = Math.min(libPlate.unmatchedItems, match.crystalPlate.unmatchedItems);
      match.libraryPlate = libPlate;
	  this.reMatchItems(match, newSize)
      this.setState({selectedLibPlate : libPlate});
      return;
    }
    this.setState({selectedLibPlate: null});
	this.props.reNumberBatches();
  }

  changeCrystalPlate(id){
    let match = this.props.match;
    this.resetMatch();
    match.resetCrystalPlate();
    this.setState({selectedCrystalPlate: null, selectedCrystalPlateId : id});
    if (id !== "none"){
      const crystalPlate = this.props.crystalPlates.find(plate => plate.id === parseInt(id));
      const newSize = Math.min(crystalPlate.unmatchedItems, match.libraryPlate.unmatchedItems);
      match.crystalPlate = crystalPlate;
	  this.reMatchItems(match, newSize)
      /*match.addItems(newSize);
      match.crystalPlate.useItems(newSize);
      match.libraryPlate.useItems(newSize);*/
      this.setState({selectedCrystalPlate: crystalPlate});
      return;
    }
    this.setState({selectedCrystalPlate: null});
	this.props.reNumberBatches();
  }

  reMatchItems(match, size){
	match.addItems(size);
	match.crystalPlate.useItems(size);
	match.libraryPlate.useItems(size);
  }

  render() {
    let libPlates = [this.props.match.libraryPlate];
	let libPlatesValue = null;
	
	//not based on state because it is sometimes out of sync
	try{
		libPlatesValue = this.props.match.libraryPlate.id;
		}
	catch(TypeError){
		libPlates = this.props.libraryPlates;
		libPlatesValue = "none";
	}

	let crystalPlates = [this.props.match.crystalPlate];
	let crystalPlatesValue = null;
	try {
		crystalPlatesValue = this.props.match.crystalPlate.id;
	}
	catch(TypeError){
		crystalPlates = this.props.crystalPlates;
		crystalPlatesValue = "none";
	}

	let batches = this.props.match.batches.map((batch, index) =>{
		try {
			return <tr key={index}>
				<td>{batch.libraryPlate.name}</td>
				<td>{batch.crystalPlate.name}</td>
				<td>{batch.size}</td>
				<td>{batch.batchNumber}</td>
				<td>TODO</td>
				<td><input type="checkbox"></input></td>
			</tr>;
		}
		catch(TypeError){
			console.log('Type error while rendering a Match component');
			return <tr key={index}><td colSpan="5"> Error: try again </td></tr>
			
		}
	})

    return (
      <React.Fragment>
        <tr className="batch-row">
          <td className="lib-plate" rowSpan="1">
            <SelectLibraryPlate 
              plates={libPlates}
              handleChange={this.changeLibraryPlate}
              value={libPlatesValue}
            />
          </td>
    
          <td className="cr-plate">
            <SelectCrystalPlate 
              plates={crystalPlates} 
              handleChange={this.changeCrystalPlate}
              value={crystalPlatesValue}
            />
          </td>
          <td>{this.props.match.size}</td>
        </tr>
        <tr>
          <td colSpan="3"  className="container-cell">
			  <div className="container-cell">
				<table className="table batch-details">
				<MainThead />
				<tbody>
					{batches}
				</tbody>
				</table>
			  </div>
          </td>
        </tr>
      </React.Fragment>
        );
    }
}

export default Match;
