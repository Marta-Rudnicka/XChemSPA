import React from 'react';
//import Navigation from './navigation.js';

function countAllByStatus(plateArray, status){
	let count = 0;
	plateArray.forEach(plate => {
			count = count + plate.crystalArray.filter(crystal => crystal.status === status).length;
	});
	return count;
}

class Sidebar extends React.Component {
	constructor(props) {
		super(props);
		this.handleApply = this.handleApply.bind(this);
		this.handleRejectLimitChange = this.handleRejectLimitChange.bind(this);
		this.handleAcceptLimitChange = this.handleAcceptLimitChange.bind(this);
		this.state = {rejectLimit: '',
					acceptLimit: '',
					};  
    }
	
	handleApply(e){
		e.preventDefault(e);
		console.log('input data passed by handleApply: ', this.state.rejectLimit, this.state.acceptLimit)
		this.props.filterByScore(this.state.rejectLimit, this.state.acceptLimit);
	}
	
	handleRejectLimitChange(e){
		this.setState({rejectLimit: e.target.value,
						acceptLimit: ''});
	}
	
	handleAcceptLimitChange(e){
		this.setState({acceptLimit: e.target.value, 
						rejectLimit: ''});
	}
	
	render() {
		const plates = this.props.plates;
		const numberOfplates = this.props.plates.length;
		const totalUsed = countAllByStatus(plates, 'used');
		const totalAccepted = countAllByStatus(plates, 'accepted');
		const totalRejected = countAllByStatus(plates, 'rejected');
		
		const rejectLimit = this.state.rejectLimit;
		const acceptLimit = this.state.acceptLimit;
		
		
	//	const placeholder = 'TODO'
		
		return (
		<div id="sidebar">
			<aside>
				<div id="summary">
				  <h3>Summary</h3>
				  Plates: <strong>{numberOfplates}</strong><br/>
				  Total used crystals: <strong>{totalUsed}</strong> <br/>
				  Total accepted crystals: <strong>{totalAccepted}</strong><br/> 
				  Total rejected crystals: <strong>{totalRejected}</strong><br />
				  Unused compounds: <strong>[TODO]</strong><br/>
				  [TODO: conslusion (e.g. 'you need 3 more crystals to test all your compounds')]
				</div>
				<div className="local-menu">
				
					<form id="upload-plate">
						<h3>Upload crystallisation plate</h3>
					  <label>Choose data file</label>
					  <input type="file" />
					  <label>Choose image directory</label>
					  <input type="file" id="crystal-images" htmlName="crystal-images" webkitdirectory multiple />
					  <label>Enter drop volume (nL):</label>
					  <input type="number" min="1" />
					  <button type="submit" id="texrank">Upload</button>
					</form>
					 
					<form id="crystal-form">
					<h3>Tools</h3>
					  <label>Remove crystals with score lower than:</label>
					  <input type="number" min="0" value={rejectLimit} onChange={this.handleRejectLimitChange}/>
					  <label>Add crystals with score higher than:</label>
					  <input type="number" min="0" value={acceptLimit} onChange={this.handleAcceptLimitChange} />
					  <button type="submit" onClick={this.handleApply}>Apply</button>
					</form>	
				</div>
			</aside>	
		</div>
		);
	}
}

export default Sidebar;
