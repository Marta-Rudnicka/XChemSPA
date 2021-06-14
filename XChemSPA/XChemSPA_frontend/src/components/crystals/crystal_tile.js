/*Component representing one crystal; contains photo of the crystal and 
 * crystal data in <div class="infobox">. The infobox is shown and hidden
 * by clicking on icons using CSS only. */

import React from 'react';
import { Bin, ChevronDown, ChevronUp, InfoCircle, Recycle } from '../reusable_components/icons.js';
import { validNaNCrystalScores } from '../reusable_components/constants.js'

class InfoBox extends React.Component {
	constructor(props){
		super(props);
		this.state = {score : this.props.crystal.score};

	}
	handleChange(event){
		const score = event.target.value;

		//don't change anything if it's not a valid score
		const parsed = parseInt(score)
		console.log('parsed: ', parsed)
		if (isNaN(parsed) && !validNaNCrystalScores.includes(score)){
			console.log('wrong value')
			return
		}
		else if (parseInt(score) > 9 || parseInt(score) < 0){
			console.log('beyond range')
			return
		}
	
		this.setState({score: score}); 

		//this.props.changeScore(this.props.plate_id, this.props.crystal.well, score);
		this.props.changeCrystalAttribute(this.props.plate_id, this.props.crystal.well, "score", score)
	}


	render(){
		let score = <input type="text" value={this.state.score} onChange={(e) => this.handleChange(e)} />;
		if (this.props.crystal.status === "used"){
			score = <span>{this.props.crystal.score}</span>;
		}
		return (
			<div className="infobox">
				<span className="right">
					<strong>X:</strong>
				</span>
				<span>{this.props.crystal.echo_x}</span>
				<span className="right">
					<strong>Y:</strong>
				</span>
				<span>{this.props.crystal.echo_y}</span>
				<span className="right">
					<strong>Score:</strong>
				</span>
					{score}
			</div>
		);
	}
	//	<span className="right"><strong>Score:</strong></span> <span>{this.props.crystal.score}</span>
	}

class CrystalTile extends React.Component {

	constructor(props){
		super(props);
		this.showInfo = this.showInfo.bind(this);
		this.hideInfo = this.hideInfo.bind(this);
		this.rejectCrystal = this.rejectCrystal.bind(this);
		this.acceptCrystal = this.acceptCrystal.bind(this);
		
		this.state = {
			showInfo: false
		}
	}

	rejectCrystal(){
		console.log('clicked icon rejectCrystal');
	}

	acceptCrystal(){
		console.log('clicked icon acceptCrystal');
	}

	showInfo(){
		this.setState({showInfo: true});
	}

	hideInfo(){
		this.setState({showInfo: false});
	}

  render() {
	const well = this.props.crystal.well;
	const plate = this.props.plateName;
	let pic = null
	let info = null;
	let infoIcon;

	if (this.props.crystal.status === 'accepted') {
		pic = <Bin size="30" handleClick = {this.props.iconAction} args={this.props.crystal} />;
	}
	else if (this.props.crystal.status === 'rejected') {
		pic = <Recycle size="30" handleClick = {this.props.iconAction} args={this.props.crystal} />;
	}

	if (this.state.showInfo){
		info = <InfoBox 
			crystal = {this.props.crystal}
			changeCrystalAttribute={this.props.changeCrystalAttribute} 
			plate_id = {this.props.plate_id}
		/>;
		infoIcon = <ChevronUp size="30" handleClick={this.hideInfo} />;
	}
	else {
		infoIcon = <ChevronDown size="30" handleClick={this.showInfo} />
	}
	
	

	return (
	  <div className='gallery slide-in-fwd-center appear' id={well}>
		  	<span className="bin-pic">{pic}</span>
			<p className="well-name">{well}</p>	
			<span className="info-icon"><InfoCircle size="20" /><br /> {infoIcon}</span>
		<div>
			{info}
			<img className="main-pic" src={this.props.crystalpic} alt="crystal" /> 
		</div>
	</div>	
	);
  }

}

export default CrystalTile;
