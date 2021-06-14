import React from 'react';
import CrystalTile from './crystal_tile.js';
import cryst from './Crystal gallery_files/crystal.png';
import {ChevronDown, ChevronUp} from '../reusable_components/icons.js';

//const cryst = '';

class CrystalGroup extends React.Component {
	
	constructor(props) {
    super(props);
    this.handleShowCrystals = this.handleShowCrystals.bind(this);
    this.handleHideCrystals = this.handleHideCrystals.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {dummy: 'value',
				displayGroup: true,
				crystals: this.props.crystals
			}
  }


	handleClick(well) {
		this.props.iconAction(well);
	}
	
	handleShowCrystals() {
		this.setState({displayGroup: true});
	}
	
	handleHideCrystals(){
		this.setState({displayGroup: false});
	}
	
	render() {
		const crystalTiles = this.props.crystals.map((crystal) =>
			<CrystalTile
			crystal = {crystal}
			key={crystal.well}
			crystalpic={cryst}
			plate_id = {this.props.plate_id}
			iconAction = {this.props.iconAction}
			//changeScore = {this.props.changeScore}
			changeCrystalAttribute = {this.props.changeCrystalAttribute}
			/>
		);
		
		let crystalGroupClass;
		let hideIconClass;
		let showIconClass;
		
		if (this.state.displayGroup) {
			//crystalGroupClass = 'crystal-group';
			crystalGroupClass = this.props.divClass;
			hideIconClass = "hide-used-crystals";
			showIconClass = 'hide';
		}
		else {
			crystalGroupClass = 'hide';
			hideIconClass = "hide";
			showIconClass = 'hide-used-crystals';
			}
			
		return(
		<div className="position-container">
			<div>
				<h3>{this.props.heading}</h3>
				<span className={showIconClass}><ChevronDown size="30" handleClick={this.handleShowCrystals} /></span>
				<span className={hideIconClass}><ChevronUp size="30" handleClick={this.handleHideCrystals} /></span>
			</div>
			<div className={crystalGroupClass}>
				{crystalTiles}
			</div>
		</div>
		);
	}
}

export default CrystalGroup;

//			<img className={showIconClass} src={show} alt="show crystals" onClick={this.handleShowCrystals} />
// <img className={hideIconClass} src={hide} alt="hide crystals" onClick={this.handleHideCrystals} />