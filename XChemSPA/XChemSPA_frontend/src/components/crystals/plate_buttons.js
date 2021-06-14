import React from 'react';

class PlateButtons extends React.Component {
	/*
	constructor(props) {
		super(props);
		this.handleShowAllDetails = this.handleShowAllDetails.bind(this);
		this.handleHideAllDetails = this.handleHideAllDetails.bind(this);
	}*/
	
	makeDisplayButtons(display){
		let displayButton;
		if (display === 'show-plate'){
			displayButton = <button className="hide-plate-button" onClick={() => this.hidePlate()}>Hide plate</button>;
		}
		else {
			displayButton = <button className="show-plate-button" onClick={() => this.showPlate()} >Show plate</button>;
		}
		return displayButton;
	}
	
	makeHideDetailsButton(display){
		if (display === 'show-plate'){
			return <button className="hide-all" onClick={this.handleHideAllDetails}>Hide all crystal details</button>;
		}
	}
	makeRemoveButton(status){
		if (status === 'unused'){
			return <button>Remove plate from experiment </button>;
		}
	}

	makeDeleteCrystalsButton(rejectedCount){
		if (rejectedCount > 0 ){
			return <button onClick={() => this.props.deleteRejectedCrystals()}>Delete rejected crystals </button>;
		}
	}
	
	showPlate(){
		this.props.show();
	}
	
	hidePlate(){
		this.props.hide();
	}
	
	render() {
		const display = this.props.displayStatus;
		return(
		  <div className="plate-buttons">
			{this.makeDisplayButtons(display)}
			{this.makeRemoveButton(this.props.status)}
			{this.makeDeleteCrystalsButton(this.props.rejectedCount)}
		  </div>
        );
	}
}

export default PlateButtons;
